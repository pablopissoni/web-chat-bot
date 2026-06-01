"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SUGGESTED_PROMPTS } from "@/components/chat/suggested-prompts";
import { cn } from "@/lib/utils";

interface SuggestionsPopoverProps {
  onPromptClick: (prompt: string) => void;
  disabled?: boolean;
}

export function SuggestionsPopover({ onPromptClick, disabled = false }: SuggestionsPopoverProps) {
  const [open, setOpen] = useState(false);

  const handleClick = (prompt: string) => {
    setOpen(false);
    onPromptClick(prompt);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          disabled={disabled}
          aria-label="Ver sugerencias"
          title="Sugerencias"
          className="h-11 w-11 shrink-0"
        >
          <Sparkles className="pointer-events-none" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-80 p-1">
        <ul className="flex flex-col gap-0.5">
          {SUGGESTED_PROMPTS.map((item) => (
            <li key={item.title}>
              <button
                type="button"
                onClick={() => handleClick(item.prompt)}
                disabled={disabled}
                className={cn(
                  "group flex w-full items-start gap-3 rounded-md p-2 text-left transition-colors",
                  "hover:bg-muted",
                  "focus-visible:outline-none focus-visible:bg-muted",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              >
                <span className="mt-0.5 text-muted-foreground group-hover:text-foreground">{item.icon}</span>
                <span className="flex flex-col">
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.prompt}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
