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
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
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
      className="border-t bg-background px-4 py-3"
    >
      <div className="mx-auto flex max-w-3xl items-end gap-2">
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
            "min-h-10 max-h-40 flex-1 resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-base outline-none transition-colors",
            "placeholder:text-muted-foreground",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isEmpty || disabled}
          aria-label="Enviar mensaje"
        >
          <Send />
        </Button>
      </div>
    </form>
  );
}
