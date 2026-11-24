import { useEffect, useState } from "react";

export default function TestCaseCard({ item, onSave, onExecute, saving }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    ...item,
    test_steps: Array.isArray(item.test_steps) ? [...item.test_steps] : [],
  });

  useEffect(() => {
    setDraft({
      ...item,
      test_steps: Array.isArray(item.test_steps) ? [...item.test_steps] : [],
    });
  }, [item]);

  function updateStep(index, value) {
    setDraft((previous) => ({
      ...previous,
      test_steps: previous.test_steps.map((step, stepIndex) => stepIndex === index ? value : step),
    }));
  }

  async function saveChanges() {
    const saved = await onSave(draft);
    if (saved) setEditing(false);
  }

  return (
    <article className="case-card">
      <div className="case-top">
        <div className="case-number">TC-{String(item.test_case_id).padStart(3, "0")}</div>
        <span className="case-type">{item.test_type || "MANUAL"}</span>
        <span className="case-status">{item.latest_execution_status || item.status || "PENDING"}</span>
        <button className="edit-button" type="button" onClick={() => setEditing((value) => !value)}>
          {editing ? "Cancel" : "Edit case"}
        </button>
      </div>

      <h3>
        {editing
          ? <input className="edit-title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
          : item.title}
      </h3>

      <p className="case-description">
        {editing
          ? <textarea value={draft.description || ""} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
          : item.description}
      </p>

      <div className="preconditions">
        <span>PRECONDITIONS</span>
        {editing
          ? <input value={draft.preconditions || ""} onChange={(event) => setDraft({ ...draft, preconditions: event.target.value })} />
          : (item.preconditions || "No preconditions specified.")}
      </div>

      <div className="case-details">
        <div className="steps-col">
          <span className="detail-label">TEST STEPS</span>
          <ol>
            {draft.test_steps.map((step, index) => (
              <li key={index}>
                {editing
                  ? <input value={step} onChange={(event) => updateStep(index, event.target.value)} />
                  : step}
              </li>
            ))}
          </ol>
          {editing && (
            <button className="add-step" type="button" onClick={() => setDraft({ ...draft, test_steps: [...draft.test_steps, ""] })}>
              + Add step
            </button>
          )}
        </div>
        <div className="expected-col">
          <span className="detail-label">EXPECTED RESULT</span>
          {editing
            ? <textarea value={draft.expected_result || ""} onChange={(event) => setDraft({ ...draft, expected_result: event.target.value })} />
            : <p>{item.expected_result}</p>}
        </div>
      </div>

      <div className="execution-row">
        <div>
          <span className="detail-label">LATEST MANUAL EXECUTION</span>
          {item.latest_execution_status
            ? <p className={`execution-state ${item.latest_execution_status.toLowerCase()}`}>
                {item.latest_execution_status}
                <small>{item.latest_execution_at ? new Date(item.latest_execution_at).toLocaleString() : ""}</small>
                {item.latest_execution_note && <small className="execution-note">Note: {item.latest_execution_note}</small>}
              </p>
            : <p className="execution-prompt">Not executed yet. Run the steps and record a result.</p>}
        </div>
        <div className="execution-actions">
          <button className="result-button pass" type="button" onClick={() => onExecute(item, "PASSED")}>✓ Passed</button>
          <button className="result-button fail" type="button" onClick={() => onExecute(item, "FAILED")}>× Failed</button>
          <button className="result-button skip" type="button" onClick={() => onExecute(item, "SKIPPED")}>– Skip</button>
        </div>
      </div>

      {editing && (
        <div className="edit-footer">
          <span>Review the test case before saving your changes.</span>
          <button className="button button-primary small" type="button" onClick={saveChanges} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      )}
    </article>
  );
}
