import type { UIMessage, UIMessagePart } from "ai";
import type { Timestamp } from "firebase-admin/firestore";

/**
 * Firestore document shapes. Keep these in sync with the structure documented
 * in CLAUDE.md ("Etapa 6 — Firestore persistence").
 */

export interface SessionDoc {
  createdAt: Timestamp;
  lastMessageAt: Timestamp;
  messageCount: number;
  // Reserved for v2 when Firebase Auth is added. Always null today.
  userId: string | null;
}

export interface MessageDoc {
  role: UIMessage["role"];
  // Raw text rendered to the user (concatenation of all text parts).
  content: string;
  // Full part array so tool invocations survive a reload.
  parts: UIMessagePart<never, never>[];
  // Stable ordering across batched writes that share the same wall clock millisecond.
  index: number;
  createdAt: Timestamp;
}

export interface LeadDoc {
  sessionId: string | null;
  name: string;
  email: string;
  interest: string;
  createdAt: Timestamp;
  status: "new" | "contacted" | "discarded";
}

export interface HandoffDoc {
  sessionId: string | null;
  reason: string;
  urgency: "low" | "medium" | "high";
  status: "pending" | "assigned" | "resolved";
  createdAt: Timestamp;
}
