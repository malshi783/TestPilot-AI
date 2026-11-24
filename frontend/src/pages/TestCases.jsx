import TestCaseCard from "../components/TestCaseCard";

export default function TestCases({
  cases = [],
  title,
  setTitle,
  description,
  setDescription,
  loading,
  error,
  notice,
  source,
  onGenerate,
  onSave,
  onExecute,
  savingId,
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">QUALITY ENGINEERING / TEST DESIGN</div>
          <h1>Test Case Studio<span className="heading-period">.</span></h1>
          <p>Turn software requirements into test scenarios worth reviewing.</p>
        </div>
        <div className="heading-badge"><span>✳</span> AI-assisted test design</div>
      </div>

      <section className="generator-card">
        <div className="card-head">
          <div className="step-icon">01</div>
          <div><h2>Start with a requirement</h2><p>Give your feature a name and describe how it should behave.</p></div>
          <div className="ai-chip"><span>✳</span> TEST DESIGN ASSISTANT</div>
        </div>

        <form onSubmit={onGenerate}>
          <label className="field-label">
            FEATURE OR REQUIREMENT TITLE
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required minLength={3} maxLength={200}
              placeholder="e.g. Secure account sign in"
            />
          </label>
          <label className="field-label">
            WHAT SHOULD HAPPEN?
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required minLength={20} maxLength={6000} rows={4}
              placeholder="Describe expected behavior, validation rules, and edge cases…"
            />
            <span className="char-count">{description.length} / 6,000</span>
          </label>
          {error && <div className="alert" role="alert">{error}</div>}
          {notice && <div className="success-notice" role="status">✓ {notice}</div>}
          <div className="generator-footer">
            <span className="privacy-hint">AI suggestions are a starting point. Review every case before use.</span>
            <button className="button button-dark" disabled={loading}>
              {loading ? "Generating…" : "Generate test cases"} <span>↗</span>
            </button>
          </div>
        </form>
      </section>

      <section className="results-section">
        <div className="results-heading">
          <div><div className="eyebrow">YOUR TEST PLAN</div><h2>Saved test cases <span className="result-total">{cases.length}</span></h2></div>
          <div className="results-tools">{cases.length ? "Saved to your workspace" : "Ready when you are"}</div>
        </div>

        {cases.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration"><div className="empty-page">☷</div><span>✳</span></div>
            <h3>Your test plan starts here</h3>
            <p>Enter a requirement above to generate practical scenarios, including positive, negative, and validation cases.</p>
          </div>
        ) : (
          <div className="case-list">
            {cases.map((item) => (
              <TestCaseCard
                key={item.test_case_id}
                item={item}
                onSave={onSave}
                onExecute={onExecute}
                saving={savingId === item.test_case_id}
              />
            ))}
          </div>
        )}

        {source === "local-demo" && cases.length > 0 && (
          <div className="demo-banner">
            <b>Local demo generation:</b> These scenarios were created by the built-in fallback, not a live AI provider.
          </div>
        )}
        {source === "llm" && cases.length > 0 && (
          <div className="demo-banner live-banner"><b>AI provider:</b> These scenarios were returned by the configured AI service. Review them before use.</div>
        )}
      </section>
    </>
  );
}
