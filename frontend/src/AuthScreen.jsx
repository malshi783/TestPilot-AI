import { useState } from "react";
import { loginUser, registerUser } from "./services/api";
export default function AuthScreen({ onLogin }) {


// ========================================
// AUTHENTICATION COMPONENT
// ========================================

    const [mode, setMode] = useState("login");

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);


    async function submit(event) {

        event.preventDefault();

        setBusy(true);
        setError("");

        try {

            const data =
                mode === "login"
                    ? await loginUser({
                        email: form.email,
                        password: form.password
                    })
                    : await registerUser(form);

            onLogin(data);

        } catch (err) {

            setError(err.message);

        } finally {

            setBusy(false);

        }
    }


    return (

        <main className="auth-layout">

            <section className="auth-story">

                <div className="brand">

                    <span className="brand-mark">T</span>

                    testpilot

                    <span className="brand-ai">.ai</span>

                </div>


                <div className="story-copy">

                    <span className="eyebrow">
                        QUALITY ENGINEERING, REIMAGINED
                    </span>

                    <h1>
                        Make every requirement
                        <br />
                        <em>testable.</em>
                    </h1>

                    <p>
                        Turn product ideas into thoughtful test plans.
                        Catch the edge cases before your users do.
                    </p>


                    <div className="story-stats">

                        <div>
                            <strong>01</strong>
                            <span>Describe</span>
                        </div>

                        <i />

                        <div>
                            <strong>02</strong>
                            <span>Generate</span>
                        </div>

                        <i />

                        <div>
                            <strong>03</strong>
                            <span>Review</span>
                        </div>

                    </div>

                </div>


                <div className="auth-foot">
                    Built for people who care about software quality.
                </div>

            </section>


            <section className="auth-panel">

                <div className="auth-box">

                    <span className="eyebrow">
                        YOUR QA WORKSPACE
                    </span>


                    <h2>
                        {mode === "login"
                            ? "Welcome back"
                            : "Create your workspace"}
                    </h2>


                    <p className="muted">

                        {mode === "login"
                            ? "Sign in to continue your quality work."
                            : "Start turning requirements into test cases."}

                    </p>


                    <form
                        onSubmit={submit}
                        className="form-stack"
                    >

                        {mode === "register" && (

                            <label>

                                Full name

                                <input
                                    type="text"
                                    required
                                    minLength="2"
                                    autoComplete="name"
                                    value={form.full_name}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            full_name: event.target.value
                                        })
                                    }
                                    placeholder="Your name"
                                />

                            </label>

                        )}


                        <label>

                            Email address

                            <input
                                type="email"
                                required
                                autoComplete="email"
                                value={form.email}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        email: event.target.value
                                    })
                                }
                                placeholder="you@example.com"
                            />

                        </label>


                        <label>

                            Password

                            <input
                                type="password"
                                required
                                minLength="8"
                                autoComplete={
                                    mode === "login"
                                        ? "current-password"
                                        : "new-password"
                                }
                                value={form.password}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        password: event.target.value
                                    })
                                }
                                placeholder="At least 8 characters"
                            />

                        </label>


                        {error && (

                            <div className="alert">
                                {error}
                            </div>

                        )}


                        <button
                            type="submit"
                            className="button button-primary full"
                            disabled={busy}
                        >

                            {busy
                                ? "Please wait..."
                                : mode === "login"
                                    ? "Sign in"
                                    : "Create account"}

                            <span>↗</span>

                        </button>

                    </form>


                    <div className="switch-auth">

                        {mode === "login"
                            ? "New to TestPilot?"
                            : "Already have an account?"}


                        <button
                            type="button"
                            onClick={() => {

                                setMode(
                                    mode === "login"
                                        ? "register"
                                        : "login"
                                );

                                setError("");

                            }}
                        >

                            {mode === "login"
                                ? "Create an account"
                                : "Sign in"}

                        </button>

                    </div>


                    <div className="auth-note">

                        <span className="spark">✳</span>

                        Your test cases stay yours.
                        Always review AI suggestions before use.

                    </div>

                </div>

            </section>

        </main>

    );

}