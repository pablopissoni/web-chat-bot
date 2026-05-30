import { Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TypingIndicator() {
  return (
    <div className="flex w-full gap-3 justify-start">
      <Avatar size="sm">
        <AvatarFallback>
          <Bot className="size-3.5" />
        </AvatarFallback>
      </Avatar>

      <div
        className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3"
        aria-label="El asistente está escribiendo"
      >
        <div className="flex gap-1">
          <span className="size-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:0ms]" />
          <span className="size-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:150ms]" />
          <span className="size-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
