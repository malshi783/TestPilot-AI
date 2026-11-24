function getMetrics(cases) {
  const metrics = {
    total: cases.length,
    passed: 0,
    failed: 0,
    skipped: 0,
    pending: 0,
  };

  for (const item of cases) {
    const status = item.latest_execution_status;
    if (status === "PASSED") metrics.passed += 1;
    else if (status === "FAILED") metrics.failed += 1;
    else if (status === "SKIPPED") metrics.skipped += 1;
    else metrics.pending += 1;
  }

  const completedCount = metrics.passed + metrics.failed;
  metrics.successRate = completedCount > 0
    ? Math.round((metrics.passed / completedCount) * 100)
    : 0;

  return metrics;
}

export default function Dashboard({ cases = [] }) {
  const metrics = getMetrics(cases);
  const cards = [
    { label: "Total test cases", value: metrics.total, hint: "Saved test scenarios", tone: "neutral" },
    { label: "Passed", value: metrics.passed, hint: "Latest execution passed", tone: "purple" },
    { label: "Failed", value: metrics.failed, hint: "Need attention", tone: "red" },
    { label: "Skipped", value: metrics.skipped, hint: "Not run to completion", tone: "blue" },
    { label: "Pending", value: metrics.pending, hint: "Not executed yet", tone: "neutral" },
  ];

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">QUALITY ENGINEERING / OVERVIEW</div>
          <h1>Testing dashboard<span className="heading-period">.</span></h1>
          <p>A live summary of your saved test cases and their latest execution results.</p>
        </div>
        <div className="heading-badge"><span>✳</span> Workspace overview</div>
      </div>

      <section className="metric-grid">
        {cards.map((card) => (
          <article className={`metric-card ${card.tone}`} key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.hint}</small>
          </article>
        ))}
      </section>

      <section className="dashboard-lower">
        <article className="panel success-panel">
          <div className="eyebrow">EXECUTION QUALITY</div>
          <h2>{metrics.successRate}%</h2>
          <p>Pass rate among test cases with a PASSED or FAILED latest result. Skipped and pending cases are excluded.</p>
          <div className="progress-track"><span style={{ width: `${metrics.successRate}%` }} /></div>
        </article>
        <article className="panel getting-started">
          <div className="eyebrow">WORKFLOW</div>
          <h2>Keep your testing visible</h2>
          <ol>
            <li>Open Test Case Studio.</li>
            <li>Describe a feature or requirement.</li>
            <li>Review and save the generated scenarios.</li>
            <li>Run each test manually and record its result.</li>
          </ol>
        </article>
      </section>

      {cases.length === 0 && (
        <div className="empty-state compact-empty">
          <div className="empty-illustration"><div className="empty-page">☷</div><span>✳</span></div>
          <h3>Your dashboard is ready</h3>
          <p>Generate your first test cases to start seeing testing statistics here.</p>
        </div>
      )}
    </>
  );
}
