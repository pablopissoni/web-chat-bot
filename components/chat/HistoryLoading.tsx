"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface HistoryLoadingProps {
  /** Time in ms before the spinner becomes visible. Defaults to 0 (immediate). */
  delayMs?: number;
}

/**
 * Shown while the chat history is being fetched from Firestore on mount.
 * Set `delayMs` > 0 to avoid flashing the spinner on fast loads.
 */
export function HistoryLoading({ delayMs = 100 }: HistoryLoadingProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(t);
  }, [delayMs]);

  if (!visible) return null;

  return (
    <div className="flex h-full items-center justify-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" aria-hidden />
        <p className="text-sm">Recuperando conversación...</p>
      </div>
    </div>
  );
}
