// import { useState } from "react";
// import { auth, db } from "../firebase/firebase";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
// const MODEL = "microsoft/Phi-4-mini-instruct";

// function AddDocument() {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const getAISummary = async (text) => {
//     try {
//       const response = await fetch("https://models.github.ai/inference/chat/completions", {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${GITHUB_TOKEN}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           model: MODEL,
//           messages: [
//             {
//               role: "system",
//               content: "You are a summarization expert. Create a 1-2 sentence summary (max 30 words). Be extremely concise."
//             },
//             {
//               role: "user",
//               content: `Summarize this in 1 sentence (max 20 words): ${text.substring(0, 1000)}`
//             }
//           ],
//           max_tokens: 50,
//           temperature: 0.1
//         })
//       });

//       if (!response.ok) return text.substring(0, 60) + "...";

//       const result = await response.json();
//       return result.choices?.[0]?.message?.content?.trim() || text.substring(0, 60) + "...";

//     } catch (error) {
//       return text.substring(0, 60) + "...";
//     }
//   };

//   const handleAdd = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const user = auth.currentUser;
//       if (!user) throw new Error("Not logged in");

//       const summary = await getAISummary(content);

//       const docRef = await addDoc(collection(db, "users", user.uid, "documents"), {
//         title,
//         content,
//         summary,
//         createdAt: serverTimestamp(),
//         authorId: user.uid
//       });

//       await addDoc(collection(db, "auditLogs"), {
//         userId: user.uid,
//         action: "create_document",
//         docId: docRef.id,
//         timestamp: serverTimestamp()
//       });

//       navigate("/dashboard");

//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{
//       maxWidth: "600px",
//       margin: "40px auto",
//       padding: "30px",
//       background: "#fff",
//       borderRadius: "12px",
//       boxShadow: "0 6px 20px rgba(0,0,0,0.1)"
//     }}>
//       <h2>Add Document</h2>
//       {loading && <p style={{ color: "#1890ff" }}>Generating AI summary... ⏳</p>}
//       <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
//         <input
//           type="text"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//         <textarea
//           placeholder="Content"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           rows={8}
//           required
//         />
//         <button type="submit" style={{
//           background: "#1890ff",
//           color: "white",
//           padding: "12px 0",
//           fontSize: "16px"
//         }} disabled={loading}>
//           {loading ? "Adding..." : "Add Document"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default AddDocument;
import { useState } from "react";
import { auth, db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

// GitHub Models API
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const MODEL = "microsoft/Phi-4-mini-instruct";

function AddDocument() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getAISummary = async (text) => {
    try {
      const response = await fetch("https://models.github.ai/inference/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content: "You are a summarization expert. Create a 1-2 sentence summary (max 30 words). Be extremely concise."
            },
            {
              role: "user",
              content: `Summarize this in 1 sentence (max 20 words): ${text.substring(0, 1000)}`
            }
          ],
          max_tokens: 50,
          temperature: 0.1
        })
      });

      if (!response.ok) return text.substring(0, 60) + "...";
      const result = await response.json();
      return result.choices?.[0]?.message?.content?.trim() || text.substring(0, 60) + "...";
    } catch (err) {
      console.error(err);
      return text.substring(0, 60) + "...";
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not logged in");

      const summary = await getAISummary(content);

      const docRef = await addDoc(collection(db, "users", user.uid, "documents"), {
        title,
        content,
        summary,
        createdAt: serverTimestamp(),
        authorId: user.uid
      });

      await addDoc(collection(db, "auditLogs"), {
        userId: user.uid,
        action: "create_document",
        docId: docRef.id,
        timestamp: serverTimestamp()
      });

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
      {/* NAV BAR */}
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
        <Link to="/dashboard" style={{ textDecoration: "none" }}>
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
          >← Back to Dashboard</button>
        </Link>
      </nav>

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
