import { NavLink, useLocation } from "react-router-dom";

const navigation = [
  { to: "/dashboard", label: "Dashboard", icon: "▦" },
  { to: "/test-cases", label: "Test Case Studio", icon: "✳" },
  { to: "/executions", label: "Test Executions", icon: "✓" },
];

const pageNames = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/requirements": "Requirements",
  "/test-cases": "Test Case Studio",
  "/executions": "Test Executions",
};

export default function Layout({ user, onLogout, testCaseCount, children }) {
  const location = useLocation();
  const initials = (user?.full_name || "User")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">T</span> testpilot<span className="brand-ai">.ai</span></div>
        <div className="workspace-label">WORKSPACE</div>
        <div className="workspace-select">
          <span className="workspace-icon">◈</span>
          <span><b>My workspace</b><small>Personal testing space</small></span>
        </div>
        <div className="nav-label">MENU</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.to === "/test-cases" && <span className="nav-count">{testCaseCount}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-star">✳</span>
            <b>Good testing starts with good questions.</b>
            <p>Describe what users need. Review what could go wrong.</p>
          </div>
          <div className="profile">
            <div className="avatar">{initials}</div>
            <div className="profile-text"><b>{user?.full_name}</b><small>{user?.email}</small></div>
            <button className="logout" onClick={onLogout} title="Sign out" aria-label="Sign out">↗</button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">My workspace <span>/</span> <b>{pageNames[location.pathname] || "Workspace"}</b></div>
          <div className="top-right"><span className="online-dot" /> AI-assisted workspace <div className="top-avatar">{initials}</div></div>
        </header>
        <div className="page-wrap">{children}</div>
      </main>
    </div>
  );
}
