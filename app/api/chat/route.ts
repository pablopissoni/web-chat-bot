import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { chatModel } from "@/lib/ai/model";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { tools } from "@/lib/ai/tools";
import { appendMessages } from "@/lib/db/sessions";
import { log } from "@/lib/logger";

export const maxDuration = 30;

const bodySchema = z.object({
  sessionId: z.string().min(1).max(64),
  messages: z.array(z.any()).min(1),
});

export async function POST(req: Request) {
  const raw = await req.json();

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    log("warn", "chat.invalidBody", {
      issues: parsed.error.issues,
      receivedKeys: Object.keys(raw ?? {}),
    });
    return Response.json(
      { error: "Invalid request body", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { sessionId, messages } = parsed.data as {
    sessionId: string;
    messages: UIMessage[];
  };

  const result = streamText({
    model: chatModel,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages, {
      tools,
    }),
    tools,
    stopWhen: stepCountIs(5),
    experimental_context: { sessionId },
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: () => crypto.randomUUID(),
    onFinish: async ({ messages: updatedMessages }) => {
      // Persist every message of the updated conversation, preserving order.
      // appendMessages uses set() keyed by message id, so re-writing the same id is idempotent.
      log("info", "chat.onFinish", {
        sessionId,
        count: updatedMessages.length,
      });

      try {
        await appendMessages(sessionId, updatedMessages);
      } catch (err) {
        log("error", "chat.onFinish.persistFailed", {
          sessionId,
          error: (err as Error).message,
        });
      }
    },
  });
}
