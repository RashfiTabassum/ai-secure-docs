import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { signOut } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
import { doc, getDoc, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

// function Dashboard() {
//   const [userData, setUserData] = useState(null);
//   const [documents, setDocuments] = useState([]);//new
//   const [loading, setLoading] = useState(true);//new
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         const userDoc = await getDoc(doc(db, "users", user.uid));
//         if (userDoc.exists()) setUserData(userDoc.data());
//       }
//     };
//     fetchUserData();
//   }, []);

//   const handleLogout = async () => {
//     await signOut(auth);
//     navigate("/");
//   };

//   if (!userData) return <p>Loading user data...</p>;

//   return (
//     <div>
//       <h2>Dashboard</h2>
//       <p>Email: {userData.email}</p>
//       <p>Role: {userData.role}</p>

//       {/* Add this button */}
//       <Link to="/add-document">
//         <button>Add Document</button>
//       </Link>

//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// }

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

    // Fetch user profile
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) setUserData(userDoc.data());
    };

    // Fetch user's documents in real-time
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

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      
      {userData && (
        <div style={{ marginBottom: "20px", padding: "10px", background: "#f0f0f0" }}>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Role:</strong> {userData.role}</p>
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <Link to="/add-document">
          <button style={{ marginRight: "10px" }}>Add New Document</button>
        </Link>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h3>Your Documents ({documents.length})</h3>
      
      {documents.length === 0 ? (
        <p>No documents yet. Create your first one!</p>
      ) : (
        documents.map((doc) => (
          <div 
            key={doc.id} 
            style={{ 
              border: "1px solid #ccc", 
              padding: "15px", 
              marginBottom: "15px",
              borderRadius: "5px"
            }}
          >
            <h4>{doc.title}</h4>
            <p><strong>Content:</strong> {doc.content}</p>
            <p style={{ 
              background: "#e8f4f8", 
              padding: "10px", 
              borderLeft: "4px solid #007acc",
              fontStyle: "italic"
            }}>
              <strong>🤖 AI Summary:</strong> {doc.summary}
            </p>
            <small style={{ color: "#666" }}>
              Created: {doc.createdAt?.toDate?.().toLocaleString() || "Just now"}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

//export default Dashboard;
export default Dashboard;
