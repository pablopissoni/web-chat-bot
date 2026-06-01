"use client";

import { Bot } from "lucide-react";
import { SUGGESTED_PROMPTS } from "@/components/chat/suggested-prompts";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  onPromptClick: (prompt: string) => void;
  disabled?: boolean;
}

export function EmptyState({ onPromptClick, disabled = false }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-10 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <Bot className="size-6" />
      </div>

      <h2 className="text-xl font-semibold tracking-tight">
        ¡Hola! Soy CallBot
      </h2>
      <p className="mt-1 mb-8 max-w-md text-sm text-muted-foreground">
        Tu asistente virtual de CallBotIA. ¿En qué puedo ayudarte hoy?
      </p>

      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
        {SUGGESTED_PROMPTS.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => onPromptClick(item.prompt)}
            disabled={disabled}
            className={cn(
              "group flex items-start gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors",
              "hover:bg-muted hover:border-foreground/20",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <span className="mt-0.5 text-muted-foreground group-hover:text-foreground">
              {item.icon}
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-medium">{item.title}</span>
              <span className="text-xs text-muted-foreground">
                {item.prompt}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
