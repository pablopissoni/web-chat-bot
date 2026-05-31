import { openai } from "@ai-sdk/openai";

// Centralized model config so we can swap it from one place (e.g. gpt-4o vs gpt-4o-mini).
// gpt-4o-mini chosen for cost: ~$0.15/M input tokens, ~$0.60/M output tokens.
export const chatModel = openai("gpt-4o-mini");
