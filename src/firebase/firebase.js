import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAvfuDjEGo6Mm32_3CW-HZyzSJaxXbPCSk",
  authDomain: "ai-notes-pro.firebaseapp.com",
  projectId: "ai-notes-pro",
  storageBucket: "ai-notes-pro.firebasestorage.app",
  messagingSenderId: "268403065553",
  appId: "1:268403065553:web:c0dea25a320a4004b53bf0"
};


const app = initializeApp(firebaseConfig);

// export default app;

export const auth = getAuth(app); //connect to authorization service
export const db = getFirestore(app); // connect to firestore database 
