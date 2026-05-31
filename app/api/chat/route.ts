import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { chatModel } from "@/lib/ai/model";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { tools } from "@/lib/ai/tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: chatModel,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools,
    // Allow up to 5 reasoning/tool-call steps so the agent can chain tools
    // (e.g. getCompanyInfo -> saveLead) without a follow-up turn.
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
