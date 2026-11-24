const { randomUUID } = require("node:crypto");
const pool = require("../config/database");
const { generateTestCases } = require("../services/testCaseGenerator");

async function getOrCreateProject(client, userId) {
  const existing = await client.query(
    `SELECT project_id FROM projects
     WHERE created_by = $1 ORDER BY project_id LIMIT 1`,
    [userId]
  );

  if (existing.rows[0]) return existing.rows[0].project_id;

  const created = await client.query(
    `INSERT INTO projects (project_name, description, created_by)
     VALUES ($1, $2, $3) RETURNING project_id`,
    [
      "My TestPilot project",
      "Requirements and test cases managed with TestPilot-AI.",
      userId,
    ]
  );

  return created.rows[0].project_id;
}

async function listTestCases(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT
         tc.test_case_id,
         tc.title,
         tc.description,
         tc.preconditions,
         tc.test_steps,
         tc.expected_result,
         tc.test_type,
         tc.status,
         tc.created_at,
         r.requirement_id,
         r.requirement_code,
         r.title AS requirement_title,
         latest.execution_status AS latest_execution_status,
         latest.error_message AS latest_execution_note,
         latest.completed_at AS latest_execution_at
       FROM test_cases tc
       JOIN projects p ON p.project_id = tc.project_id
       LEFT JOIN requirement_test_cases rtc ON rtc.test_case_id = tc.test_case_id
       LEFT JOIN requirements r ON r.requirement_id = rtc.requirement_id
       LEFT JOIN LATERAL (
         SELECT execution_status, error_message, completed_at
         FROM test_executions e
         WHERE e.test_case_id = tc.test_case_id
           AND e.executed_by = $1
         ORDER BY e.completed_at DESC NULLS LAST, e.execution_id DESC
         LIMIT 1
       ) latest ON true
       WHERE p.created_by = $1
       ORDER BY tc.created_at DESC, tc.test_case_id DESC
       LIMIT 200`,
      [req.user.user_id]
    );

    return res.json({ success: true, test_cases: result.rows });
  } catch (error) {
    return next(error);
  }
}

async function generateFromRequirement(req, res, next) {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const description = typeof req.body.description === "string"
    ? req.body.description.trim()
    : "";

  if (
    title.length < 3
    || title.length > 200
    || description.length < 20
    || description.length > 6000
  ) {
    return res.status(400).json({
      success: false,
      message: "Enter a title and a requirement description between 20 and 6,000 characters.",
    });
  }

  let generated;
  try {
    generated = await generateTestCases(`${title}\n\n${description}`);
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: error.message || "Could not generate test cases.",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const projectId = await getOrCreateProject(client, req.user.user_id);
    const requirementCode = `REQ-${Date.now()}-${randomUUID().slice(0, 8)}`;

    const requirementResult = await client.query(
      `INSERT INTO requirements (project_id, requirement_code, title, description)
       VALUES ($1, $2, $3, $4)
       RETURNING requirement_id, requirement_code, title, description, created_at`,
      [projectId, requirementCode, title, description]
    );

    const savedCases = [];

    for (const testCase of generated.cases) {
      const savedResult = await client.query(
        `INSERT INTO test_cases
           (project_id, title, description, preconditions, test_steps, expected_result, test_type)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7)
         RETURNING test_case_id, title, description, preconditions,
                   test_steps, expected_result, test_type, status, created_at`,
        [
          projectId,
          testCase.title,
          testCase.description,
          testCase.preconditions,
          JSON.stringify(testCase.test_steps),
          testCase.expected_result,
          testCase.test_type,
        ]
      );

      const savedCase = savedResult.rows[0];
      await client.query(
        `INSERT INTO requirement_test_cases (requirement_id, test_case_id)
         VALUES ($1, $2)`,
        [requirementResult.rows[0].requirement_id, savedCase.test_case_id]
      );

      savedCases.push({
        ...savedCase,
        requirement_title: requirementResult.rows[0].title,
        requirement_id: requirementResult.rows[0].requirement_id,
      });
    }

    await client.query(
      `INSERT INTO ai_analysis_records
         (project_id, analysis_type, input_reference, ai_response, created_by)
       VALUES ($1, 'TEST_CASE_GENERATION', $2, $3, $4)`,
      [
        projectId,
        requirementCode,
        JSON.stringify({ source: generated.source, test_cases: generated.cases }),
        req.user.user_id,
      ]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      requirement: requirementResult.rows[0],
      test_cases: savedCases,
      generation_source: generated.source,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return next(error);
  } finally {
    client.release();
  }
}

async function updateTestCase(req, res, next) {
  const id = Number(req.params.id);
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const description = typeof req.body.description === "string" ? req.body.description.trim() : "";
  const preconditions = typeof req.body.preconditions === "string" ? req.body.preconditions.trim() : "";
  const expectedResult = typeof req.body.expected_result === "string"
    ? req.body.expected_result.trim()
    : "";
  const steps = Array.isArray(req.body.test_steps)
    ? req.body.test_steps.map((step) => String(step).trim()).filter(Boolean).slice(0, 20)
    : [];

  if (
    !Number.isInteger(id)
    || id < 1
    || !title
    || title.length > 200
    || !expectedResult
    || steps.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Provide a valid title, at least one test step, and an expected result.",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE test_cases tc
       SET title = $1,
           description = $2,
           preconditions = $3,
           test_steps = $4::jsonb,
           expected_result = $5
       FROM projects p
       WHERE tc.project_id = p.project_id
         AND tc.test_case_id = $6
         AND p.created_by = $7
       RETURNING tc.test_case_id, tc.title, tc.description, tc.preconditions,
                 tc.test_steps, tc.expected_result, tc.test_type, tc.status, tc.created_at`,
      [
        title,
        description,
        preconditions,
        JSON.stringify(steps),
        expectedResult,
        id,
        req.user.user_id,
      ]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Test case not found.",
      });
    }

    return res.json({ success: true, test_case: result.rows[0] });
  } catch (error) {
    return next(error);
  }
}

async function recordExecution(req, res, next) {
  const id = Number(req.params.id);
  const status = req.body.status;
  const note = typeof req.body.note === "string"
    ? req.body.note.trim().slice(0, 2000)
    : "";

  if (
    !Number.isInteger(id)
    || id < 1
    || !["PASSED", "FAILED", "SKIPPED"].includes(status)
  ) {
    return res.status(400).json({
      success: false,
      message: "Choose PASSED, FAILED, or SKIPPED.",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO test_executions
         (test_case_id, executed_by, execution_status, started_at, completed_at, error_message)
       SELECT tc.test_case_id, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $4
       FROM test_cases tc
       JOIN projects p ON p.project_id = tc.project_id
       WHERE tc.test_case_id = $1 AND p.created_by = $2
       RETURNING execution_id, test_case_id, execution_status,
                 started_at, completed_at, error_message`,
      [id, req.user.user_id, status, note || null]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Test case not found.",
      });
    }

    return res.status(201).json({
      success: true,
      execution: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
}

async function listExecutions(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT
         e.execution_id,
         e.test_case_id,
         tc.title AS test_case_title,
         e.execution_status,
         e.started_at,
         e.completed_at,
         e.error_message,
         u.full_name AS executed_by_name
       FROM test_executions e
       JOIN test_cases tc ON tc.test_case_id = e.test_case_id
       JOIN projects p ON p.project_id = tc.project_id
       JOIN users u ON u.user_id = e.executed_by
       WHERE p.created_by = $1 AND e.executed_by = $1
       ORDER BY e.completed_at DESC NULLS LAST, e.execution_id DESC
       LIMIT 200`,
      [req.user.user_id]
    );

    return res.json({ success: true, executions: result.rows });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listTestCases,
  generateFromRequirement,
  updateTestCase,
  recordExecution,
  listExecutions,
};
