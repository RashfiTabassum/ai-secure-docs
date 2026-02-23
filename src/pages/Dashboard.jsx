import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { subscribeToDocuments, removeDocument } from "../services/documentService";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/");
      return;
    }

    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) setUserData(userDoc.data());
    };

    const unsubscribe = subscribeToDocuments(user.uid, (docs) => {
      setDocuments(docs);
      setLoading(false);
    });

    fetchUserData();
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleDelete = async (docId) => {
    const user = auth.currentUser;
    if (!user) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this document?");
    if (!confirmDelete) return;

    try {
      await removeDocument(user.uid, docId);
      alert("Document deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete document");
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
        <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>Loading your documents...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #eef2ff 0%, #fce7f3 50%, #e0f2fe 100%)",
      fontFamily: "'Poppins', sans-serif",
      color: "#1e293b"
    }}>
      <Navbar user={userData} onLogout={handleLogout} />

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "36px 20px" }}>

        {/* STATS BAR */}
        <div style={{
          display: "flex",
          gap: "16px",
          marginBottom: "32px",
          flexWrap: "wrap"
        }}>
          <div style={{
            flex: 1,
            minWidth: "140px",
            background: "#fff",
            border: "1px solid #e0e7ff",
            borderRadius: "16px",
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(99,102,241,0.08)"
          }}>
            <p style={{ margin: 0, fontSize: "30px", fontWeight: "800", color: "#6366f1" }}>{documents.length}</p>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#9ca3af", fontWeight: "500" }}>Total Documents</p>
          </div>
          <div style={{
            flex: 1,
            minWidth: "140px",
            background: "#fff",
            border: "1px solid #d1fae5",
            borderRadius: "16px",
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(16,185,129,0.08)"
          }}>
            <p style={{ margin: 0, fontSize: "30px", fontWeight: "800", color: "#10b981" }}>
              {documents.filter(d => d.summary).length}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#9ca3af", fontWeight: "500" }}>AI Summarized</p>
          </div>
          <div style={{
            flex: 1,
            minWidth: "140px",
            background: "#fff",
            border: "1px solid #fce7f3",
            borderRadius: "16px",
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(236,72,153,0.08)"
          }}>
            <p style={{ margin: 0, fontSize: "30px", fontWeight: "800", color: "#ec4899" }}>
              {documents.filter(d => {
                const created = d.createdAt?.toDate?.();
                if (!created) return false;
                const now = new Date();
                return (now - created) < 7 * 24 * 60 * 60 * 1000;
              }).length}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#9ca3af", fontWeight: "500" }}>This Week</p>
          </div>
        </div>

        {/* PAGE HEADER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#1e293b" }}>
            My Documents
          </h2>
          <Link to="/add-document" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "10px 22px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
              transition: "all 0.2s"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.35)"; }}
            >
              <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span> New Document
            </button>
          </Link>
        </div>

        {/* DOCUMENT CARDS */}
        {documents.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "#fff",
            borderRadius: "20px",
            border: "2px dashed #c7d2fe",
            boxShadow: "0 2px 12px rgba(99,102,241,0.06)"
          }}>
            <p style={{ fontSize: "48px", margin: "0 0 16px" }}>📝</p>
            <p style={{ color: "#6b7280", fontSize: "15px", margin: "0 0 20px" }}>No documents yet</p>
            <Link to="/add-document" style={{ textDecoration: "none" }}>
              <button style={{
                padding: "10px 24px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(99,102,241,0.35)"
              }}>Create Your First Document</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {documents.map((d, i) => {
              const accentColors = ["#6366f1","#ec4899","#10b981","#f59e0b","#06b6d4"];
              const accent = accentColors[i % 5];
              return (
              <div key={d.id} style={{
                background: "#fff",
                borderRadius: "16px",
                borderLeft: `4px solid ${accent}`,
                padding: "20px 20px 20px 18px",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "16px",
                transition: "all 0.25s ease",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
              }}
                onClick={() => navigate(`/document/${d.id}`)}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = `0 8px 28px rgba(0,0,0,0.08), 0 0 0 1px ${accent}22`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Doc info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{
                    margin: 0,
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#1e293b",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>{d.title}</h4>
                  <p style={{
                    margin: "6px 0 0",
                    fontSize: "13px",
                    color: "#6b7280",
                    lineHeight: "1.5",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {d.summary || (d.content ? d.content.substring(0, 120) : "No content")}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: "11px",
                      color: "#9ca3af",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      🕒 {d.createdAt?.toDate?.().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) || "Just now"}
                    </span>
                    {d.summary && (
                      <span style={{
                        fontSize: "10px",
                        color: "#10b981",
                        background: "#ecfdf5",
                        padding: "2px 10px",
                        borderRadius: "10px",
                        fontWeight: "600",
                        border: "1px solid #d1fae5"
                      }}>AI Summary</span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{
                  display: "flex",
                  gap: "8px",
                  flexShrink: 0,
                  alignItems: "center"
                }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/document/${d.id}`); }}
                    style={{
                      padding: "7px 16px",
                      borderRadius: "8px",
                      border: "1px solid #c7d2fe",
                      background: "#eef2ff",
                      color: "#6366f1",
                      fontWeight: "600",
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#6366f1"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#6366f1"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#eef2ff"; e.currentTarget.style.color = "#6366f1"; e.currentTarget.style.borderColor = "#c7d2fe"; }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(d.id); }}
                    style={{
                      padding: "7px 16px",
                      borderRadius: "8px",
                      border: "1px solid #fecaca",
                      background: "#fef2f2",
                      color: "#dc2626",
                      fontWeight: "600",
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#dc2626"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.borderColor = "#fecaca"; }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
