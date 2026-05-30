"use client";

import { useState } from "react";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import type { Message } from "@/types/chat";

const mockMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "¡Hola! Soy CallBot, el asistente virtual de CallBotIA. ¿En qué puedo ayudarte hoy?",
    createdAt: new Date(),
  },
];

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    const text = input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // mock response — se reemplaza en Etapa 3 con el endpoint real
    setTimeout(() => {
      const reply: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Recibí tu mensaje: "${text}". (Esta es una respuesta mockeada, en la próxima etapa conectamos OpenAI).`,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, reply]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="border-b px-4 py-3">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-sm font-semibold">CallBot</h1>
          <p className="text-xs text-muted-foreground">Asistente virtual de CallBotIA</p>
        </div>
      </header>

      <MessageList messages={messages} isLoading={isLoading} />

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={isLoading}
      />
    </div>
  );
}
