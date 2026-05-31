import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type { UIMessage } from "ai";
import { adminDb } from "@/lib/db/firebase.admin";
import { log } from "@/lib/logger";

const SESSIONS = "sessions";
const MESSAGES = "messages";

/**
 * Removes undefined values recursively. Firestore rejects undefined fields,
 * and UIMessage parts can carry them (e.g. errorText on input-streaming state).
 */
function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => stripUndefined(v)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === undefined) continue;
      out[k] = stripUndefined(v);
    }
    return out as T;
  }
  return value;
}

function textOf(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } & typeof p => p.type === "text")
    .map((p) => p.text)
    .join("");
}

/**
 * Appends one or more messages to a session, creating the session doc if it does not exist.
 * Idempotent on message IDs: a re-run with the same UIMessage.id will overwrite the same doc.
 */
export async function appendMessages(
  sessionId: string,
  messages: UIMessage[]
): Promise<void> {
  if (messages.length === 0) return;

  const db = adminDb();
  const sessionRef = db.collection(SESSIONS).doc(sessionId);
  const batch = db.batch();

  // Use a base timestamp and offset each message by its index (in ms).
  // This guarantees a stable order across calls even when persisted in the same batch.
  const baseMs = Date.now();

  // Upsert session metadata. userId is reserved for v2 (Firebase Auth).
  batch.set(
    sessionRef,
    {
      createdAt: FieldValue.serverTimestamp(),
      lastMessageAt: Timestamp.fromMillis(baseMs + messages.length),
      messageCount: messages.length,
      userId: null,
    },
    { merge: true }
  );

  messages.forEach((msg, i) => {
    const ref = sessionRef.collection(MESSAGES).doc(msg.id);
    batch.set(ref, {
      role: msg.role,
      content: textOf(msg),
      parts: stripUndefined(msg.parts),
      // index field guarantees order even if two writes share the same wall clock millisecond.
      index: i,
      createdAt: Timestamp.fromMillis(baseMs + i),
    });
  });

  await batch.commit();

  log("info", "db.appendMessages", {
    sessionId,
    count: messages.length,
  });
}

export async function getMessages(sessionId: string): Promise<UIMessage[]> {
  const db = adminDb();
  const snap = await db
    .collection(SESSIONS)
    .doc(sessionId)
    .collection(MESSAGES)
    .orderBy("index", "asc")
    .get();

  return snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      role: data.role,
      parts: data.parts ?? [{ type: "text", text: data.content ?? "" }],
    } as UIMessage;
  });
}
