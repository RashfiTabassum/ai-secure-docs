// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { doc, deleteDoc, collection, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
// import { auth, db } from "../firebase/firebase";

// const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
// const MODEL = "microsoft/Phi-4-mini-instruct";

// function DocumentCard({ doc: document, onDelete }) {
//   const navigate = useNavigate();
//   const [loadingSummary, setLoadingSummary] = useState(false);
//   const [updated, setUpdated] = useState(false);

//   // Truncate helper
//   const truncate = (text, maxLength = 100) => {
//     if (!text) return "";
//     return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
//   };

//   const handleDelete = async (e) => {
//     e.stopPropagation();
//     const user = auth.currentUser;
//     if (!user) return;

//     const confirmDelete = window.confirm("Are you sure you want to delete this document?");
//     if (!confirmDelete) return;

//     try {
//       await deleteDoc(doc(db, "users", user.uid, "documents", document.id));
//       await addDoc(collection(db, "auditLogs"), {
//         userId: user.uid,
//         action: "delete_document",
//         docId: document.id,
//         timestamp: serverTimestamp(),
//       });
//       onDelete?.();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete document");
//     }
//   };

//   const handleRegenerateSummary = async (e) => {
//     e.stopPropagation();
//     const user = auth.currentUser;
//     if (!user) return;
//     setLoadingSummary(true);

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
//             {
//               role: "system",
//               content: "You are a summarization expert. Create a 1-2 sentence summary (max 30 words). Be extremely concise.",
//             },
//             {
//               role: "user",
//               content: `Summarize this in 1 sentence (max 20 words): ${document.content.substring(0, 1000)}`,
//             },
//           ],
//           max_tokens: 50,
//           temperature: 0.1,
//         }),
//       });

//       if (!response.ok) throw new Error("AI summary failed");

//       const result = await response.json();
//       const newSummary = result.choices?.[0]?.message?.content?.trim() || document.summary || "No summary available";

//       // Update Firestore document
//       await updateDoc(doc(db, "users", user.uid, "documents", document.id), {
//         summary: newSummary,
//       });

//       // Audit log
//       await addDoc(collection(db, "auditLogs"), {
//         userId: user.uid,
//         action: "regenerate_summary",
//         docId: document.id,
//         timestamp: serverTimestamp(),
//       });

//       // Show a small “Updated!” message
//       setUpdated(true);
//       setTimeout(() => setUpdated(false), 1500);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to regenerate summary");
//     } finally {
//       setLoadingSummary(false);
//     }
//   };

//   return (
//     <div
//       onClick={() => navigate(`/document/${document.id}`)}
//       style={{
//         border: "1px solid #ddd",
//         padding: "15px",
//         marginBottom: "15px",
//         borderRadius: "8px",
//         background: "white",
//         boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//         cursor: "pointer",
//       }}
//     >
//       <h4 style={{ marginTop: 0 }}>{document.title}</h4>

//       <p style={{ color: "#666", fontSize: "14px" }}>
//         <strong>Preview:</strong> {truncate(document.content, 100)}
//       </p>

//       <div
//         style={{
//           background: "#e6f7ff",
//           padding: "10px",
//           borderLeft: "4px solid #1890ff",
//           borderRadius: "4px",
//           margin: "10px 0",
//         }}
//       >
//         <strong>🤖 AI Summary:</strong> {document.summary || "No summary available"}
//         {updated && <span style={{ color: "#1890ff", marginLeft: "8px" }}>Updated!</span>}
//       </div>

//       <small style={{ color: "#999", display: "block", marginBottom: "10px" }}>
//         Created: {document.createdAt?.toDate?.().toLocaleString() || "Just now"}
//       </small>

//       <div style={{ display: "flex", gap: "10px" }}>
//         <button
//           onClick={handleDelete}
//           style={{
//             background: "#ff4d4f",
//             color: "white",
//             border: "none",
//             padding: "8px 16px",
//             borderRadius: "4px",
//             cursor: "pointer",
//             flex: 1,
//           }}
//         >
//           Delete
//         </button>

//         <button
//           onClick={handleRegenerateSummary}
//           style={{
//             background: "#1890ff",
//             color: "white",
//             border: "none",
//             padding: "8px 16px",
//             borderRadius: "4px",
//             cursor: "pointer",
//             flex: 1,
//           }}
//           disabled={loadingSummary}
//         >
//           {loadingSummary ? "Regenerating..." : "Save + Regenerate Summary"}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default DocumentCard;

import { useNavigate } from "react-router-dom";
import { doc, deleteDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

function DocumentCard({ doc: document, onDelete }) {
  const navigate = useNavigate();

  const truncate = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    const user = auth.currentUser;
    if (!user) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this document?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "documents", document.id));
      await addDoc(collection(db, "auditLogs"), {
        userId: user.uid,
        action: "delete_document",
        docId: document.id,
        timestamp: serverTimestamp()
      });
      alert("Document deleted successfully");
      onDelete?.();
    } catch (err) {
      console.error(err);
      alert("Failed to delete document");
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "8px",
        background: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}
    >
      <h4 style={{ marginTop: 0 }}>{document.title}</h4>
      <p style={{ color: "#666", fontSize: "14px" }}>
        <strong>Preview:</strong> {truncate(document.content, 100)}
      </p>
      <div
        style={{
          background: "#e6f7ff",
          padding: "10px",
          borderLeft: "4px solid #1890ff",
          borderRadius: "4px",
          margin: "10px 0"
        }}
      >
        <strong>🤖 AI Summary:</strong> {document.summary || "No summary available"}
      </div>

      <small style={{ color: "#999", display: "block", marginBottom: "10px" }}>
        Created: {document.createdAt?.toDate?.().toLocaleString() || "Just now"}
      </small>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => navigate(`/document/${document.id}`)}
          style={{
            flex: 1,
            background: "#1890ff",
            color: "white",
            border: "none",
            padding: "8px 0",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          style={{
            flex: 1,
            background: "#ff4d4f",
            color: "white",
            border: "none",
            padding: "8px 0",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default DocumentCard;
