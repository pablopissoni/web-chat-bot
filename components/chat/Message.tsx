import { Bot, User } from "lucide-react";
import type { UIMessage } from "ai";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageMarkdown } from "@/components/chat/MessageMarkdown";
import { ToolInvocation } from "@/components/chat/ToolInvocation";
import { cn } from "@/lib/utils";

interface MessageProps {
  message: UIMessage;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar size="sm">
          <AvatarFallback>
            <Bot className="size-3.5" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex max-w-[80%] flex-col gap-2", isUser && "items-end")}>
        {message.parts.map((part, i) => {
          if (part.type === "text") {
            if (!part.text) return null;
            return (
              <div
                key={i}
                className={cn(
                  "rounded-2xl px-4 py-2.5",
                  isUser
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                )}
              >
                {isUser ? (
                  <span className="text-base leading-relaxed whitespace-pre-wrap">
                    {part.text}
                  </span>
                ) : (
                  <MessageMarkdown variant="assistant">{part.text}</MessageMarkdown>
                )}
              </div>
            );
          }

          if (part.type.startsWith("tool-")) {
            const toolName = part.type.replace(/^tool-/, "");
            const state =
              "state" in part && typeof part.state === "string"
                ? (part.state as
                    | "input-streaming"
                    | "input-available"
                    | "output-available"
                    | "output-error")
                : "input-available";
            return <ToolInvocation key={i} toolName={toolName} state={state} />;
          }

          return null;
        })}
      </div>

      {isUser && (
        <Avatar size="sm">
          <AvatarFallback>
            <User className="size-3.5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
