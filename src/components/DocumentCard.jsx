import { doc, deleteDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

function DocumentCard({ doc: document, onDelete }) {
  // Truncate helper
  const truncate = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const handleDelete = async () => {
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
      onDelete(); // Notify parent to refresh
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
      
      <div style={{ 
        background: "#e6f7ff", 
        padding: "10px", 
        borderLeft: "4px solid #1890ff",
        borderRadius: "4px",
        margin: "10px 0"
      }}>
        <strong>🤖 AI Summary:</strong> {document.summary || "No summary available"}
      </div>

      <small style={{ color: "#999", display: "block", marginBottom: "10px" }}>
        Created: {document.createdAt?.toDate?.().toLocaleString() || "Just now"}
      </small>

      <button 
        onClick={handleDelete}
        style={{ 
          background: "#ff4d4f", 
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Delete
      </button>
    </div>
  );
}

export default DocumentCard;