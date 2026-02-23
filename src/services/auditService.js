// Logs every sensitive action (create, update, delete) to the
// top-level "auditLogs" Firestore collection for traceability.

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

/**
 * Write an audit log entry.
 * @param {string} userId  – The UID of the acting user
 * @param {string} action  – e.g. "create_document"
 * @param {string} docId   – The affected document ID
 * @param {Object} [meta]  – Optional extra metadata
 */
export async function logAction(userId, action, docId, meta = {}) {
  try {
    await addDoc(collection(db, "auditLogs"), {
      userId,
      action,
      docId,
      ...meta,
      timestamp: serverTimestamp()
    });
  } catch (err) {
    // Non-blocking – audit failure should not break the main flow
    console.error("Audit log failed:", err.message);
  }
}
