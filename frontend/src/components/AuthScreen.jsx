import { useState } from "react";
import { loginUser, registerUser } from "../services/api";

export default function AuthScreen({ onLogin, message = "" }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const payload = {
        email: form.email.trim(),
        password: form.password,
        ...(mode === "register" ? { full_name: form.full_name.trim() } : {}),
      };
      const data = mode === "login"
        ? await loginUser(payload)
        : await registerUser(payload);
      onLogin(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  function switchMode() {
    setMode((current) => current === "login" ? "register" : "login");
    setError("");
    setForm({ full_name: "", email: "", password: "" });
  }

  return (
    <main className="auth-layout">
      <section className="auth-story">
        <div className="brand"><span className="brand-mark">T</span> testpilot<span className="brand-ai">.ai</span></div>
        <div className="story-copy">
          <span className="eyebrow">QUALITY ENGINEERING WORKSPACE</span>
          <h1>Make every requirement <em>testable.</em></h1>
          <p>Turn product requirements into thoughtful test plans. Review scenarios, record manual results, and keep testing progress visible.</p>
          <div className="story-stats">
            <div><strong>01</strong><span>Describe</span></div><i />
            <div><strong>02</strong><span>Generate</span></div><i />
            <div><strong>03</strong><span>Review</span></div>
          </div>
        </div>
        <div className="auth-foot">AI suggestions are a starting point. Human review still matters.</div>
      </section>

      <section className="auth-panel">
        <div className="auth-box">
          <span className="eyebrow">YOUR QA WORKSPACE</span>
          <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="muted">{mode === "login" ? "Sign in to continue your quality work." : "Start managing your software test cases."}</p>

          {message && <div className="alert" role="alert">{message}</div>}

          <form onSubmit={handleSubmit} className="form-stack">
            {mode === "register" && (
              <label>Full name
                <input
                  value={form.full_name}
                  onChange={(event) => setForm({ ...form, full_name: event.target.value })}
                  required minLength={2} maxLength={100} autoComplete="name"
                  placeholder="Your full name"
                />
              </label>
            )}
            <label>Email address
              <input
                type="email" value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required autoComplete="email" placeholder="you@example.com"
              />
            </label>
            <label>Password
              <input
                type="password" value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required minLength={8}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="At least 8 characters"
              />
            </label>
            {error && <div className="alert" role="alert">{error}</div>}
            <button className="button button-primary full" disabled={busy}>
              {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
              <span>↗</span>
            </button>
          </form>

          <div className="switch-auth">
            {mode === "login" ? "New to TestPilot?" : "Already have an account?"}
            <button type="button" onClick={switchMode}>
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </div>
          <div className="auth-note"><span className="spark">✳</span> Review AI-generated test cases before using them.</div>
        </div>
      </section>
    </main>
  );
}
