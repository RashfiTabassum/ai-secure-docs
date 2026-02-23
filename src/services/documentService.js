// Centralized Firestore CRUD for user documents.
// Each mutation also writes an audit log entry via auditService.

import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { logAction } from "./auditService";

const userDocsCollection = (uid) => collection(db, "users", uid, "documents");
const userDocRef = (uid, docId) => doc(db, "users", uid, "documents", docId);

/** Create a new document. Returns the new document ID. */
export async function createDocument(uid, { title, content, summary }) {
  const docRef = await addDoc(userDocsCollection(uid), {
    title,
    content,
    summary: summary || "",
    createdAt: serverTimestamp(),
    authorId: uid
  });

  await logAction(uid, "create_document", docRef.id);
  return docRef.id;
}

/** Fetch a single document by ID. */
export async function fetchDocument(uid, docId) {
  const snap = await getDoc(userDocRef(uid, docId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** Update an existing document. */
export async function updateDocument(uid, docId, updates) {
  await updateDoc(userDocRef(uid, docId), {
    ...updates,
    updatedAt: serverTimestamp()
  });

  await logAction(uid, "update_document", docId);
}

/** Delete a document. */
export async function removeDocument(uid, docId) {
  await deleteDoc(userDocRef(uid, docId));

  await logAction(uid, "delete_document", docId);
}

/** Subscribe to real-time document list (newest first). Returns unsubscribe fn. */
export function subscribeToDocuments(uid, callback) {
  const q = query(userDocsCollection(uid), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(docs);
  });
}
