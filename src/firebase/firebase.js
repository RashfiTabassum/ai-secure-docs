import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Reads from env vars; falls back to defaults for local dev
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAvfuDjEGo6Mm32_3CW-HZyzSJaxXbPCSk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-notes-pro.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-notes-pro",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-notes-pro.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "268403065553",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:268403065553:web:c0dea25a320a4004b53bf0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
