import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AuthScreen from "./components/AuthScreen";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Requirements from "./pages/Requirements";
import TestCases from "./pages/TestCases";
import Executions from "./pages/Executions";

import {
  getCurrentUser,
  getTestCases,
  generateTestCases,
  updateTestCase,
  recordTestExecution,
} from "./services/api";

const SAMPLE_TITLE = "Secure account sign in";
const SAMPLE_DESCRIPTION =
  "A registered user can sign in using a valid email address and password. Empty fields should be rejected with clear validation messages. Invalid credentials must not grant access. The sign-in form should handle email values without case sensitivity.";

function readStoredSession() {
  try {
    const stored = JSON.parse(localStorage.getItem("testpilot-session"));
    return stored?.token && stored?.user ? stored : null;
  } catch {
    localStorage.removeItem("testpilot-session");
    return null;
  }
}

export default function App() {
  const [session, setSession] = useState(readStoredSession);
  const [isCheckingSession, setIsCheckingSession] = useState(() => Boolean(readStoredSession()?.token));
  const [sessionError, setSessionError] = useState("");

  const [cases, setCases] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [title, setTitle] = useState(SAMPLE_TITLE);
  const [description, setDescription] = useState(SAMPLE_DESCRIPTION);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [source, setSource] = useState("");

  function executionRows(testCases) {
    return testCases
      .filter((item) => item.latest_execution_status)
      .map((item) => ({
        execution_id: `${item.test_case_id}-${item.latest_execution_at || item.latest_execution_status}`,
        test_case_id: item.test_case_id,
        test_case_title: item.title,
        execution_status: item.latest_execution_status,
        executed_by_name: session?.user?.full_name || "You",
        completed_at: item.latest_execution_at,
        error_message: item.latest_execution_note,
      }));
  }

  const loadWorkspace = useCallback(async () => {
    const token = session?.token;
    if (!token) {
      setCases([]);
      setExecutions([]);
      return;
    }

    try {
      const caseData = await getTestCases(token);
      const loadedCases = caseData.test_cases || [];
      setCases(loadedCases);
      setExecutions(executionRows(loadedCases));
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  }, [session?.token]);

  // Validate a saved JWT once when the token changes.
  useEffect(() => {
    let active = true;
    const token = session?.token;

    if (!token) {
      setIsCheckingSession(false);
      return () => {
        active = false;
      };
    }

    async function validateSession() {
      try {
        const data = await getCurrentUser(token);
        if (!active) return;

        const updatedSession = { user: data.user, token };
        localStorage.setItem("testpilot-session", JSON.stringify(updatedSession));
        setSession(updatedSession);
        setSessionError("");
      } catch (requestError) {
        if (!active) return;
        setSessionError(requestError.message || "Your session has expired. Please sign in again.");
        localStorage.removeItem("testpilot-session");
        setSession(null);
        setCases([]);
        setExecutions([]);
      } finally {
        if (active) setIsCheckingSession(false);
      }
    }

    validateSession();
    return () => {
      active = false;
    };
  }, [session?.token]);

  // Load workspace data only after authentication has been checked.
  useEffect(() => {
    if (!isCheckingSession && session?.token) {
      loadWorkspace();
    }
  }, [isCheckingSession, session?.token, loadWorkspace]);

  function signIn(data) {
    const value = { user: data.user, token: data.token };
    localStorage.setItem("testpilot-session", JSON.stringify(value));
    setSessionError("");
    setError("");
    setNotice("");
    setCases([]);
    setExecutions([]);
    setIsCheckingSession(true);
    setSession(value);
  }

  function signOut() {
    localStorage.removeItem("testpilot-session");
    setSession(null);
    setIsCheckingSession(false);
    setCases([]);
    setExecutions([]);
    setError("");
    setNotice("");
    setSessionError("");
    setSource("");
  }

  async function generate(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const data = await generateTestCases({ title, description }, session.token);
      const generatedCases = data.test_cases || [];
      setCases((previous) => [...generatedCases, ...previous]);
      setSource(data.generation_source || "");
      setNotice(`${generatedCases.length} test cases generated and saved.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveCase(testCase) {
    setSavingId(testCase.test_case_id);
    setError("");
    setNotice("");

    try {
      const data = await updateTestCase(testCase.test_case_id, testCase, session.token);
      setCases((previous) => previous.map((item) => (
        item.test_case_id === testCase.test_case_id
          ? { ...item, ...data.test_case }
          : item
      )));
      setNotice("Test case updated successfully.");
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setSavingId(null);
    }
  }

  async function recordExecution(testCase, status) {
    let note = "";

    if (status === "FAILED") {
      note = window.prompt("What did you observe? (optional)");
      if (note === null) return;
    }

    setError("");
    setNotice("");

    try {
      await recordTestExecution(testCase.test_case_id, { status, note }, session.token);
      await loadWorkspace();
      setNotice(`Manual execution recorded: ${status}.`);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (isCheckingSession) {
    return (
      <div className="session-loading">
        <div className="loading-mark">T</div>
        <h2>Checking your session…</h2>
        <p>Please wait while TestPilot-AI verifies your account.</p>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen onLogin={signIn} message={sessionError} />;
  }

  return (
    <Layout user={session.user} onLogout={signOut} testCaseCount={cases.length}>
      {error && <div className="alert global-feedback" role="alert">{error}</div>}
      {notice && <div className="success-notice global-feedback" role="status">✓ {notice}</div>}

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard cases={cases} />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/requirements" element={<Requirements />} />
        <Route
          path="/test-cases"
          element={(
            <TestCases
              cases={cases}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              loading={loading}
              error=""
              notice=""
              source={source}
              onGenerate={generate}
              onSave={saveCase}
              onExecute={recordExecution}
              savingId={savingId}
            />
          )}
        />
        <Route path="/executions" element={<Executions executions={executions} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <footer className="page-footer">
        <span>TESTPILOT-AI <i>·</i> QUALITY ENGINEERING</span>
        <span>AI suggestions should always be reviewed by a tester.</span>
      </footer>
    </Layout>
  );
}
