const express = require("express");
const {
  listTestCases,
  generateFromRequirement,
  updateTestCase,
  recordExecution,
  listExecutions,
} = require("../controllers/qualityController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);
router.get("/test-cases", listTestCases);
router.get("/executions", listExecutions);
router.post("/requirements/generate", generateFromRequirement);
router.patch("/test-cases/:id", updateTestCase);
router.post("/test-cases/:id/executions", recordExecution);

module.exports = router;
