import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, collection, query, orderBy, onSnapshot, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import DocumentCard from "../components/DocumentCard";

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

    const q = query(
      collection(db, "users", user.uid, "documents"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
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

  // NEW: Delete logic in parent (Dashboard)
  const handleDelete = async (docId) => {
    const user = auth.currentUser;
    if (!user) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this document?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "documents", docId));

      await addDoc(collection(db, "auditLogs"), {
        userId: user.uid,
        action: "delete_document",
        docId: docId,
        timestamp: serverTimestamp()
      });

      alert("Document deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete document");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Dashboard</h2>
      
      {userData && (
        <div style={{ marginBottom: "20px", padding: "10px", background: "#f0f0f0", borderRadius: "5px" }}>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Role:</strong> {userData.role}</p>
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <Link to="/add-document">
          <button style={{ marginRight: "10px", padding: "10px 20px" }}>Add New Document</button>
        </Link>
        <button onClick={handleLogout} style={{ padding: "10px 20px" }}>Logout</button>
      </div>

      <h3>Your Documents ({documents.length})</h3>
      
      {documents.length === 0 ? (
        <p>No documents yet. Create your first one!</p>
      ) : (
        documents.map((doc) => (
          <DocumentCard 
            key={doc.id} 
            doc={doc} 
            onDelete={handleDelete} // Pass delete function to child
          />
        ))
      )}
    </div>
  );
}

export default Dashboard;