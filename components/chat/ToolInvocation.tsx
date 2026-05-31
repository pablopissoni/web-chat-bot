import { CheckCircle2, Loader2, Wrench, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolInvocationProps {
  toolName: string;
  state: "input-streaming" | "input-available" | "output-available" | "output-error";
}

const LABELS: Record<string, string> = {
  getCompanyInfo: "Consultando información de CallBotIA",
  saveLead: "Registrando tu interés",
  handoffToHuman: "Derivando con un agente humano",
};

export function ToolInvocation({ toolName, state }: ToolInvocationProps) {
  const label = LABELS[toolName] ?? `Ejecutando ${toolName}`;
  const isRunning = state === "input-streaming" || state === "input-available";
  const isError = state === "output-error";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
        isError
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : isRunning
            ? "border-border bg-muted text-muted-foreground"
            : "border-border bg-muted text-foreground"
      )}
    >
      {isError ? (
        <XCircle className="size-3.5" />
      ) : isRunning ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <CheckCircle2 className="size-3.5" />
      )}
      <span>{label}</span>
      {!isRunning && !isError && (
        <Wrench className="size-3 opacity-50" aria-hidden />
      )}
    </div>
  );
}
