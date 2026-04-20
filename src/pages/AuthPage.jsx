import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const USERS_KEY = "fitup-auth-users";
const SESSION_KEY = "fitup-auth-session";
const DEMO_USER = {
  email: "demo@fitup.app",
  memberId: "DEMO123",
  password: "demo1234",
};

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function ensureDemoUser() {
  const users = readUsers();
  const hasDemo = users.some(
    (u) => u.email === DEMO_USER.email && u.memberId === DEMO_USER.memberId,
  );
  if (hasDemo) return;
  saveUsers([...users, DEMO_USER]);
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginMemberId, setLoginMemberId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerMemberId, setRegisterMemberId] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const title = useMemo(
    () => (mode === "login" ? "Login to FitUp" : "Create your account"),
    [mode],
  );

  const useDemoAccount = () => {
    ensureDemoUser();
    setMode("login");
    setLoginEmail(DEMO_USER.email);
    setLoginMemberId(DEMO_USER.memberId);
    setLoginPassword(DEMO_USER.password);
    setMessage("Demo account filled. Tap Login.");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const email = registerEmail.trim().toLowerCase();
    const memberId = registerMemberId.trim().toUpperCase();

    if (!email || !memberId || !registerPassword) {
      setMessage("Please fill email, ID, and password.");
      return;
    }
    if (registerPassword.length < 6) {
      setMessage("Password should be at least 6 characters.");
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const users = readUsers();
    const exists = users.some((u) => u.email === email || u.memberId === memberId);
    if (exists) {
      setMessage("Email or ID already exists. Please login.");
      setMode("login");
      return;
    }

    const nextUsers = [...users, { email, memberId, password: registerPassword }];
    saveUsers(nextUsers);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email, memberId }));
    navigate("/gyms", { replace: true });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const email = loginEmail.trim().toLowerCase();
    const memberId = loginMemberId.trim().toUpperCase();
    const password = loginPassword;

    if (!email || !memberId || !password) {
      setMessage("Enter email, ID, and password.");
      return;
    }

    const users = readUsers();
    const match = users.find(
      (u) => u.email === email && u.memberId === memberId && u.password === password,
    );
    if (!match) {
      setMessage("Invalid credentials. Please try again.");
      return;
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: match.email, memberId: match.memberId }));
    navigate("/gyms", { replace: true });
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-kicker">Welcome to FitUp</p>
        <h1 className="auth-title">{title}</h1>
        <p className="auth-subtitle">Use your email + member ID. Set your own password.</p>
        <button type="button" className="auth-demo" onClick={useDemoAccount}>
          Use Demo Account
        </button>

        <div className="auth-mode-tabs" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={`auth-mode-tab${mode === "login" ? " auth-mode-tab--active" : ""}`}
            onClick={() => {
              setMode("login");
              setMessage("");
            }}
          >
            Login
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            className={`auth-mode-tab${mode === "register" ? " auth-mode-tab--active" : ""}`}
            onClick={() => {
              setMode("register");
              setMessage("");
            }}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <label className="auth-label" htmlFor="auth-login-email">
              Email
            </label>
            <input
              id="auth-login-email"
              type="email"
              className="auth-input"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="you@email.com"
              autoComplete="email"
            />

            <label className="auth-label" htmlFor="auth-login-id">
              Member ID
            </label>
            <input
              id="auth-login-id"
              type="text"
              className="auth-input"
              value={loginMemberId}
              onChange={(e) => setLoginMemberId(e.target.value)}
              placeholder="FIT1234"
              autoComplete="username"
            />

            <label className="auth-label" htmlFor="auth-login-password">
              Password
            </label>
            <input
              id="auth-login-password"
              type="password"
              className="auth-input"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
            />

            <button type="submit" className="auth-submit">
              Login
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <label className="auth-label" htmlFor="auth-register-email">
              Email
            </label>
            <input
              id="auth-register-email"
              type="email"
              className="auth-input"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              placeholder="you@email.com"
              autoComplete="email"
            />

            <label className="auth-label" htmlFor="auth-register-id">
              Member ID
            </label>
            <input
              id="auth-register-id"
              type="text"
              className="auth-input"
              value={registerMemberId}
              onChange={(e) => setRegisterMemberId(e.target.value)}
              placeholder="FIT1234"
              autoComplete="username"
            />

            <label className="auth-label" htmlFor="auth-register-password">
              Create Password
            </label>
            <input
              id="auth-register-password"
              type="password"
              className="auth-input"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />

            <label className="auth-label" htmlFor="auth-register-password-confirm">
              Confirm Password
            </label>
            <input
              id="auth-register-password-confirm"
              type="password"
              className="auth-input"
              value={registerConfirmPassword}
              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              autoComplete="new-password"
            />

            <button type="submit" className="auth-submit">
              Create Account
            </button>
          </form>
        )}

        {message ? <p className="auth-message">{message}</p> : null}
        <p className="auth-demo-hint">
          Demo: {DEMO_USER.email} / {DEMO_USER.memberId} / {DEMO_USER.password}
        </p>
      </section>
    </main>
  );
}

export default AuthPage;
