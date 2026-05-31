"use client";

import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";

const SESSION_KEY = "chatSessionId";

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant" as const,
  parts: [
    {
      type: "text" as const,
      text: "¡Hola! Soy CallBot, el asistente virtual de CallBotIA. ¿En qué puedo ayudarte hoy?",
    },
  ],
};

function readOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function ChatContainer() {
  const [sessionId, setSessionId] = useState<string>("");
  const [input, setInput] = useState("");
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const { messages, sendMessage, setMessages, status, error } = useChat();

  // Build the sessionId once on mount.
  useEffect(() => {
    setSessionId(readOrCreateSessionId());
  }, []);

  // Load past messages once we know the sessionId.
  useEffect(() => {
    if (!sessionId || historyLoaded) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}/messages`);
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data: { messages: typeof messages } = await res.json();
        if (!cancelled && data.messages.length > 0) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error("[chat] history load failed:", err);
      } finally {
        if (!cancelled) setHistoryLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId, historyLoaded, setMessages]);

  useEffect(() => {
    if (error) {
      console.error("[chat] stream error:", error);
      toast.error("No pude obtener una respuesta. Probá de nuevo.");
    }
  }, [error]);

  const messagesToShow = messages.length === 0 ? [WELCOME_MESSAGE] : messages;
  const isBusy = status === "submitted" || status === "streaming";

  const handleSubmit = () => {
    const text = input.trim();
    if (!text || isBusy || !sessionId) return;
    setInput("");
    void sendMessage({ text }, { body: { sessionId } });
  };

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="border-b px-4 py-3">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-base font-semibold">CallBot</h1>
          <p className="text-sm text-muted-foreground">
            Asistente virtual de CallBotIA
          </p>
        </div>
      </header>

      <MessageList
        messages={messagesToShow}
        isLoading={status === "submitted"}
      />

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={isBusy || !sessionId}
      />
    </div>
  );
}
