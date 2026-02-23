import { useState } from "react"; //lets component "remember" things (like what user typed in the form).
import { createUserWithEmailAndPassword } from "firebase/auth"; 
import { auth, db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // NEW: Store error message
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Clear old errors
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "member",
        createdAt: new Date()
      });

      navigate("/dashboard");

    } catch (error) {
     setError(error.message); // NEW: Show error on screen
    }
  };

  return (
    <div>
      <h2>Register</h2>
        {/* NEW: Show error message */}
      {error && <p style={{color: "red"}}>{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;