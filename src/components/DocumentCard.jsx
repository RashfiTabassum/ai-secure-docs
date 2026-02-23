import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { removeDocument } from "../services/documentService";

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
      await removeDocument(user.uid, document.id);
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
        <strong>AI Summary:</strong> {document.summary || "No summary available"}
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
