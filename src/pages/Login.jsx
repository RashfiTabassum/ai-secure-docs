import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) return setError("No user data found");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #eef2ff 0%, #fce7f3 50%, #e0f2fe 100%)",
      fontFamily: "'Poppins', sans-serif",
      padding: "20px",
      overflow: "hidden",
      position: "fixed",
      top: 0,
      left: 0
    }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 20px 60px rgba(99,102,241,0.15)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* HEADER */}
        <div style={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "#fff",
          padding: "32px 24px",
          textAlign: "center"
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            margin: "0 auto 12px"
          }}>📄</div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>AI Doc Manager</h1>
          <p style={{ marginTop: "8px", fontSize: "13px", fontWeight: "400", opacity: 0.85 }}>
            Log in to manage your documents and generate AI summaries
          </p>
        </div>

        {/* FORM */}
        <div style={{ padding: "32px 24px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "24px", color: "#1e293b", fontSize: "20px", fontWeight: "700" }}>Welcome back</h2>

          {error && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              padding: "10px 14px",
              marginBottom: "16px",
              fontSize: "13px",
              color: "#dc2626",
              textAlign: "center"
            }}>{error}</div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", marginBottom: "6px", display: "block" }}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #e0e7ff",
                  outline: "none",
                  fontSize: "14px",
                  width: "100%",
                  boxSizing: "border-box",
                  transition: "all 0.2s",
                  background: "#f8faff"
                }}
                onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "#e0e7ff"; e.target.style.boxShadow = "none"; }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", marginBottom: "6px", display: "block" }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #e0e7ff",
                  outline: "none",
                  fontSize: "14px",
                  width: "100%",
                  boxSizing: "border-box",
                  transition: "all 0.2s",
                  background: "#f8faff"
                }}
                onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "#e0e7ff"; e.target.style.boxShadow = "none"; }}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontWeight: "600",
                fontSize: "15px",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                marginTop: "4px"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.35)"; }}
            >
              Login
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "13px", color: "#6b7280", marginTop: "24px" }}>
            Don't have an account? <Link to="/register" style={{ color: "#6366f1", fontWeight: "600", textDecoration: "none" }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
