// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { doc, getDoc, updateDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
// import { auth, db } from "../firebase/firebase";

// const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
// const MODEL = "microsoft/Phi-4-mini-instruct";

// function DocumentDetail() {
//   const { docId } = useParams();
//   const navigate = useNavigate();
//   const [document, setDocument] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [summary, setSummary] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [updated, setUpdated] = useState(false);

//   useEffect(() => {
//     const fetchDoc = async () => {
//       const user = auth.currentUser;
//       if (!user) {
//         navigate("/");
//         return;
//       }

//       const docRef = doc(db, "users", user.uid, "documents", docId);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         setDocument(data);
//         setTitle(data.title);
//         setContent(data.content);
//         setSummary(data.summary || "No summary available");
//       } else {
//         alert("Document not found");
//         navigate("/dashboard");
//       }
//       setLoading(false);
//     };

//     fetchDoc();
//   }, [docId, navigate]);

//   const getAISummary = async (text) => {
//     try {
//       const response = await fetch("https://models.github.ai/inference/chat/completions", {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${GITHUB_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: MODEL,
//           messages: [
//             { role: "system", content: "You are a summarization expert. Create a 1-2 sentence summary (max 30 words)." },
//             { role: "user", content: `Summarize this in 1 sentence (max 20 words): ${text.substring(0, 1000)}` }
//           ],
//           max_tokens: 50,
//           temperature: 0.1,
//         }),
//       });

//       if (!response.ok) return text.substring(0, 60) + "...";

//       const result = await response.json();
//       return result.choices?.[0]?.message?.content?.trim() || text.substring(0, 60) + "...";
//     } catch (err) {
//       console.error("AI summary failed:", err);
//       return text.substring(0, 60) + "...";
//     }
//   };

//   const handleSave = async () => {
//     const user = auth.currentUser;
//     if (!user) return;

//     setSaving(true);
//     try {
//       const newSummary = await getAISummary(content);

//       const docRef = doc(db, "users", user.uid, "documents", docId);
//       await updateDoc(docRef, {
//         title,
//         content,
//         summary: newSummary,
//         updatedAt: serverTimestamp(),
//       });

//       await addDoc(collection(db, "auditLogs"), {
//         userId: user.uid,
//         action: "update_document",
//         docId,
//         timestamp: serverTimestamp(),
//       });

//       setSummary(newSummary);
//       setUpdated(true);
//       setTimeout(() => setUpdated(false), 1500);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save document");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <p>Loading document...</p>;

//   return (
//     <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
//       <h2>Document Detail</h2>

//       {/* Editable Card */}
//       <div
//         style={{
//           border: "1px solid #ddd",
//           padding: "15px",
//           borderRadius: "8px",
//           background: "white",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
//         }}
//       >
//         {/* Title Input */}
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Title"
//           style={{
//             width: "100%",
//             padding: "10px",
//             fontSize: "16px",
//             marginBottom: "10px",
//             borderRadius: "6px",
//             border: "1px solid #ccc"
//           }}
//         />

//         {/* Content Textarea */}
//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           rows={8}
//           placeholder="Content"
//           style={{
//             width: "100%",
//             padding: "10px",
//             fontSize: "14px",
//             borderRadius: "6px",
//             border: "1px solid #ccc",
//             marginBottom: "10px"
//           }}
//         />

//         {/* AI Summary Box */}
//         <div
//           style={{
//             background: "#e6f7ff",
//             padding: "10px",
//             borderLeft: "4px solid #1890ff",
//             borderRadius: "4px",
//             marginBottom: "10px"
//           }}
//         >
//           <strong>🤖 AI Summary:</strong> {summary || "No summary available"}
//         </div>

//         <small style={{ color: "#999", display: "block", marginBottom: "10px" }}>
//           Created: {document.createdAt?.toDate?.().toLocaleString() || "Just now"}
//         </small>

//         <div style={{ display: "flex", gap: "10px" }}>
//           <button
//             onClick={handleSave}
//             disabled={saving}
//             style={{
//               flex: 1,
//               background: "#1890ff",
//               color: "white",
//               border: "none",
//               padding: "10px 0",
//               borderRadius: "6px",
//               cursor: "pointer"
//             }}
//           >
//             {saving ? "Saving & Generating Summary..." : "Save Changes + AI Summary"}
//           </button>

//           <button
//             onClick={() => navigate("/dashboard")}
//             style={{
//               flex: 1,
//               border: "1px solid #ddd",
//               padding: "10px 0",
//               borderRadius: "6px",
//               cursor: "pointer",
//               background: "white"
//             }}
//           >
//             Back to Dashboard
//           </button>
//         </div>

//         {updated && <p style={{ color: "#1890ff", marginTop: "10px" }}>Document updated!</p>}
//       </div>
//     </div>
//   );
// }

// export default DocumentDetail;
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const MODEL = "microsoft/Phi-4-mini-instruct";

function DocumentDetail() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/");
        return;
      }

      const docRef = doc(db, "users", user.uid, "documents", docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setDocument(data);
        setTitle(data.title);
        setContent(data.content);
      } else {
        alert("Document not found");
        navigate("/dashboard");
      }
      setLoading(false);
    };

    fetchDoc();
  }, [docId, navigate]);

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
            { role: "system", content: "You are a summarization expert. Create a 1-2 sentence summary (max 30 words)." },
            { role: "user", content: `Summarize this in 1 sentence (max 20 words): ${text.substring(0, 1000)}` }
          ],
          max_tokens: 50,
          temperature: 0.1
        })
      });

      if (!response.ok) return text.substring(0, 60) + "...";
      const result = await response.json();
      return result.choices?.[0]?.message?.content?.trim() || text.substring(0, 60) + "...";
    } catch (err) {
      console.error("AI summary failed:", err);
      return text.substring(0, 60) + "...";
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    try {
      const summary = await getAISummary(content);

      const docRef = doc(db, "users", user.uid, "documents", docId);
      await updateDoc(docRef, {
        title,
        content,
        summary,
        updatedAt: serverTimestamp()
      });

      await addDoc(collection(db, "auditLogs"), {
        userId: user.uid,
        action: "update_document",
        docId,
        timestamp: serverTimestamp()
      });

      alert("Document updated with new AI summary!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to save document");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #eef2ff 0%, #fce7f3 50%, #e0f2fe 100%)",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "3px solid #e0e7ff",
          borderTopColor: "#6366f1",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 16px"
        }} />
        <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>Loading document...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

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
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "#1e293b" }}>Edit Document</h2>
          <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#6b7280" }}>
            Update your content and regenerate the AI summary
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
          {/* AI Summary preview */}
          {document?.summary && (
            <div style={{
              background: "#ecfdf5",
              border: "1px solid #d1fae5",
              borderLeft: "4px solid #10b981",
              borderRadius: "10px",
              padding: "14px 16px",
              marginBottom: "20px",
              fontSize: "13px",
              color: "#065f46",
              lineHeight: "1.5"
            }}>
              <span style={{ fontWeight: "700", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                🤖 AI Summary
              </span>
              {document.summary}
            </div>
          )}

          {/* Meta info */}
          <div style={{
            display: "flex",
            gap: "16px",
            marginBottom: "20px",
            flexWrap: "wrap"
          }}>
            <span style={{
              fontSize: "11px",
              color: "#9ca3af",
              background: "#f8faff",
              padding: "4px 12px",
              borderRadius: "8px",
              border: "1px solid #e0e7ff"
            }}>
              🕒 Created: {document?.createdAt?.toDate?.().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) || "Just now"}
            </span>
            {document?.updatedAt && (
              <span style={{
                fontSize: "11px",
                color: "#9ca3af",
                background: "#f8faff",
                padding: "4px 12px",
                borderRadius: "8px",
                border: "1px solid #e0e7ff"
              }}>
                ✏️ Updated: {document.updatedAt?.toDate?.().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) || ""}
              </span>
            )}
          </div>

          <form style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", marginBottom: "6px", display: "block" }}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Title"
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={10}
                placeholder="Content"
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

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                style={{
                  flex: 2,
                  padding: "13px",
                  borderRadius: "10px",
                  border: "none",
                  background: saving ? "#c7d2fe" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: saving ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  boxShadow: saving ? "none" : "0 4px 14px rgba(99,102,241,0.35)"
                }}
                onMouseEnter={e => { if (!saving) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.45)"; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = saving ? "none" : "0 4px 14px rgba(99,102,241,0.35)"; }}
              >
                {saving ? "Saving & Generating Summary..." : "Save + AI Summary"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                style={{
                  flex: 1,
                  padding: "13px",
                  borderRadius: "10px",
                  border: "1px solid #e0e7ff",
                  background: "#fff",
                  color: "#6b7280",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f8faff"; e.currentTarget.style.borderColor = "#c7d2fe"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e0e7ff"; }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DocumentDetail;
