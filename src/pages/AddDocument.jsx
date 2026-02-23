import { useState } from "react";
import { auth, db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


// GitHub Models API - FREE, no backend needed!
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN; // Make sure to set this in your .env.local file
const MODEL = "microsoft/Phi-4-mini-instruct"; // Updated to Phi-4


function AddDocument() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getAISummary = async (text) => {
    try {

      console.log("Token starts with:", GITHUB_TOKEN.substring(0, 10));
      console.log("Using model:", MODEL);

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

      console.log("Status:", response.status);
      console.log("Status text:", response.statusText);

      if (!response.ok) {
        return text.substring(0, 60) + "...";
      }

      const result = await response.json();
      console.log("Success! Result:", result);


      if (result.choices && result.choices[0]?.message?.content) {
        return result.choices[0].message.content.trim();
      }
      
      return text.substring(0, 60) + "...";
      
    } catch (error) {
      console.error("AI summary failed:", error);
      console.error("Fetch error:", error);
      return text.substring(0, 60) + "...";
    }
  };


  const handleAdd = async (e) => {
    e.preventDefault();
     setLoading(true); //new

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not logged in");

      const summary = await getAISummary(content);

      const docRef = await addDoc(
        collection(db, "users", user.uid, "documents"),
        {
          title,
          content,
          summary,
          createdAt: serverTimestamp(),
          authorId: user.uid
        }
      );

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
    <div>
      <h2>Add Document</h2>
      {loading && <p>Generating AI summary with Phi-4... ⏳</p>}
      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Document"}
        </button>
      </form>
    </div>
  );
}

export default AddDocument;
