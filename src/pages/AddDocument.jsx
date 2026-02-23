import { useState } from "react";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getAISummary } from "../services/aiService";
import { createDocument } from "../services/documentService";

function AddDocument() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not logged in");

      const { summary } = await getAISummary(content);
      await createDocument(user.uid, { title, content, summary });

      alert("Document added with summary!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #eef2ff 0%, #fce7f3 50%, #e0f2fe 100%)",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <Navbar backTo="/dashboard" backLabel="← Back to Dashboard" />

      {/* CONTENT */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "36px 20px" }}>
        {/* Page title */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "#1e293b" }}>Add New Document</h2>
          <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#6b7280" }}>
            Write your content and an AI summary will be generated automatically
          </p>
        </div>

        {/* Form card */}
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "28px 24px",
          boxShadow: "0 2px 12px rgba(99,102,241,0.06)",
          border: "1px solid rgba(99,102,241,0.08)"
        }}>
          {loading && (
            <div style={{
              background: "#eef2ff",
              border: "1px solid #c7d2fe",
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "20px",
              fontSize: "13px",
              color: "#6366f1",
              textAlign: "center",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}>
              <span style={{ display: "inline-block", animation: "spin 1s linear infinite", fontSize: "14px" }}>⏳</span>
              Generating AI summary...
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", marginBottom: "6px", display: "block" }}>Title</label>
              <input
                type="text"
                placeholder="Enter document title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
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
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", marginBottom: "6px", display: "block" }}>Content</label>
              <textarea
                placeholder="Write your document content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={10}
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #e0e7ff",
                  outline: "none",
                  fontSize: "14px",
                  width: "100%",
                  boxSizing: "border-box",
                  resize: "vertical",
                  transition: "all 0.2s",
                  background: "#f8faff",
                  lineHeight: "1.6"
                }}
                onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "#e0e7ff"; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "13px",
                borderRadius: "10px",
                border: "none",
                background: loading ? "#c7d2fe" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontWeight: "600",
                fontSize: "15px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: loading ? "none" : "0 4px 14px rgba(99,102,241,0.35)",
                marginTop: "4px"
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.45)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 14px rgba(99,102,241,0.35)"; }}
            >
              {loading ? "Adding..." : "Add Document"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddDocument;
