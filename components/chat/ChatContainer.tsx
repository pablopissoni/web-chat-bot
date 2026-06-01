"use client";

import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { EmptyState } from "@/components/chat/EmptyState";
import { SuggestionsPopover } from "@/components/chat/SuggestionsPopover";

const SESSION_KEY = "chatSessionId";

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

  const isBusy = status === "submitted" || status === "streaming";
  const showEmptyState = messages.length === 0 && historyLoaded;

  const submitText = (text: string) => {
    if (!text.trim() || isBusy || !sessionId) return;
    void sendMessage({ text }, { body: { sessionId } });
  };

  const handleSubmit = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    submitText(text);
  };

  const handleNewConversation = () => {
    // Generate a fresh sessionId in localStorage. Old data stays in Firestore.
    const newId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, newId);
    setSessionId(newId);
    setMessages([]);
    setInput("");
    toast.success("Nueva conversación iniciada");
  };

  return (
    <div className="flex h-svh flex-col bg-background">
      <header className="shrink-0 border-b bg-background px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <h1 className="text-base font-semibold">CallBot</h1>
            <p className="text-sm text-muted-foreground">Asistente virtual de CallBotIA</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleNewConversation}
            disabled={isBusy || !sessionId}
            aria-label="Empezar una nueva conversación"
          >
            <Plus className="size-3.5" />
            Empezar de nuevo
          </Button>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        {showEmptyState ? (
          <div className="flex h-full items-center">
            <EmptyState onPromptClick={submitText} disabled={isBusy || !sessionId} />
          </div>
        ) : (
          <MessageList messages={messages} isLoading={status === "submitted"} />
        )}
      </main>

      <footer className="shrink-0 border-t bg-background">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          disabled={isBusy || !sessionId}
          leadingSlot={
            !showEmptyState ? (
              <SuggestionsPopover
                onPromptClick={submitText}
                disabled={isBusy || !sessionId}
              />
            ) : null
          }
        />
      </footer>
    </div>
  );
}
