"use client";

import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";

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

export function ChatContainer() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat();

  // Mostramos el mensaje de bienvenida solo cuando no hay historial.
  const messagesToShow =
    messages.length === 0 ? [WELCOME_MESSAGE] : messages;

  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (error) {
      console.error("[chat] stream error:", error);
      toast.error("No pude obtener una respuesta. Probá de nuevo.");
    }
  }, [error]);

  const handleSubmit = () => {
    const text = input.trim();
    if (!text || isBusy) return;
    setInput("");
    void sendMessage({ text });
  };

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="border-b px-4 py-3">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-sm font-semibold">CallBot</h1>
          <p className="text-xs text-muted-foreground">
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
        disabled={isBusy}
      />
    </div>
  );
}
