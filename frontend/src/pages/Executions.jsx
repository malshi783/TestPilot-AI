export default function Executions({ executions = [] }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">QUALITY ENGINEERING / RESULTS</div>
          <h1>Test executions<span className="heading-period">.</span></h1>
          <p>Review the manual execution history recorded in your workspace.</p>
        </div>
        <div className="heading-badge">{executions.length} recorded results</div>
      </div>

      {executions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration"><div className="empty-page">✓</div><span>✳</span></div>
          <h3>No execution results yet</h3>
          <p>Open Test Case Studio and record a PASSED, FAILED, or SKIPPED result after manually running a test case.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="execution-table">
            <thead>
              <tr><th>Test case</th><th>Result</th><th>Executed by</th><th>Date</th><th>Note</th></tr>
            </thead>
            <tbody>
              {executions.map((execution) => (
                <tr key={execution.execution_id}>
                  <td><b>{execution.test_case_title}</b><small>TC-{String(execution.test_case_id).padStart(3, "0")}</small></td>
                  <td><span className={`status-pill ${execution.execution_status.toLowerCase()}`}>{execution.execution_status}</span></td>
                  <td>{execution.executed_by_name}</td>
                  <td>{execution.completed_at ? new Date(execution.completed_at).toLocaleString() : "—"}</td>
                  <td className="execution-note-cell">{execution.error_message || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
