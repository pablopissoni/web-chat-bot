"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FormEvent, KeyboardEvent } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  leadingSlot?: React.ReactNode;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  leadingSlot,
}: ChatInputProps) {
  const isEmpty = value.trim().length === 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isEmpty || disabled) return;
    onSubmit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isEmpty || disabled) return;
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background px-4 py-3"
    >
      <div className="mx-auto flex max-w-3xl items-center gap-2">
        {leadingSlot}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribí un mensaje..."
          rows={1}
          maxLength={2000}
          aria-label="Mensaje"
          disabled={disabled}
          className={cn(
            "min-h-11 max-h-40 flex-1 resize-none rounded-lg border border-input bg-transparent px-3 py-2.5 text-base outline-none transition-colors",
            "placeholder:text-muted-foreground",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
        <Button
          type="submit"
          size="icon-lg"
          disabled={isEmpty || disabled}
          aria-label="Enviar mensaje"
          className="h-11 w-11 shrink-0"
        >
          <Send className="pointer-events-none" />
        </Button>
      </div>
    </form>
  );
}
