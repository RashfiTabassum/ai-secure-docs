import { Link } from "react-router-dom";

/**
 * Reusable top navigation bar.
 *
 * @param {Object}    props
 * @param {Object}    [props.user]       – { email } to show avatar/email badge
 * @param {Function}  [props.onLogout]   – If provided, renders a Logout button
 * @param {string}    [props.backTo]     – Route path for a "← Back" button
 * @param {string}    [props.backLabel]  – Label text for the back button
 * @param {React.ReactNode} [props.children] – Extra right-side content
 */
export default function Navbar({ user, onLogout, backTo, backLabel, children }) {
  return (
    <nav style={{
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(99,102,241,0.1)",
      padding: "12px 32px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "sticky",
      top: 0,
      zIndex: 10
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "34px",
          height: "34px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          boxShadow: "0 2px 8px rgba(99,102,241,0.3)"
        }}>📄</div>
        <h1 style={{
          margin: 0,
          fontSize: "18px",
          fontWeight: "700",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>AI Doc Manager</h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* User badge */}
        {user?.email && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#f1f0ff",
            padding: "6px 14px",
            borderRadius: "20px"
          }}>
            <div style={{
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #ec4899)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              color: "#fff",
              fontWeight: "700"
            }}>{user.email.charAt(0).toUpperCase()}</div>
            <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "500" }}>{user.email}</span>
          </div>
        )}

        {/* Extra content slot */}
        {children}

        {/* Back button */}
        {backTo && (
          <Link to={backTo} style={{ textDecoration: "none" }}>
            <button style={{
              padding: "7px 18px",
              borderRadius: "8px",
              border: "1px solid #c7d2fe",
              background: "#eef2ff",
              color: "#6366f1",
              fontWeight: "600",
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#6366f1"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#6366f1"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#eef2ff"; e.currentTarget.style.color = "#6366f1"; e.currentTarget.style.borderColor = "#c7d2fe"; }}
            >{backLabel || "← Back"}</button>
          </Link>
        )}

        {/* Logout button */}
        {onLogout && (
          <button onClick={onLogout} style={{
            padding: "7px 18px",
            borderRadius: "8px",
            border: "1px solid #fecaca",
            background: "#fef2f2",
            color: "#dc2626",
            fontWeight: "600",
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#dc2626"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.borderColor = "#fecaca"; }}
          >Logout</button>
        )}
      </div>
    </nav>
  );
}
