@AGENTS.md

# CallBotIA Web Chat — Project Context

> **Note for the agent**: This file is the source of truth for project decisions, conventions, and current status. Read it fully before suggesting architectural changes. If you disagree with a decision, surface it explicitly with reasoning — don't silently refactor.

## Overview

This is a technical assessment project: a **WebChatBot with agentic AI capabilities** for CallBotIA. The goal is to demonstrate Senior Full Stack AI Developer skills across frontend, backend, AI integration, and deployment.

Hard requirements from the brief:
- Frontend: Next.js (App Router), TypeScript, Tailwind, shadcn/ui
- Backend with AI: streaming responses, agentic logic (tool calling, intent detection, handoff simulation)
- Deploy on Vercel
- At least one external API integration
- Conversation history
- Modern UX

Timeline: 3-5 days.

## Tech Stack

| Layer | Technology | Version / Notes |
|-------|------------|-----------------|
| Framework | Next.js (App Router) | 16.2.x |
| Runtime | React | 19.2.x |
| Language | TypeScript | strict mode + `noUncheckedIndexedAccess` |
| Styling | Tailwind CSS | v4 (PostCSS plugin, no `tailwind.config`) |
| UI Components | shadcn/ui | Preset: `radix-nova`, Base color: `neutral`, Icons: Lucide |
| AI SDK | Vercel AI SDK (`ai`, `@ai-sdk/openai`) | latest |
| LLM | OpenAI GPT-4o-mini | via Vercel AI SDK |
| Validation | Zod | for tool params and API contracts |
| Persistence | Firebase Firestore | Admin SDK on server, sessionId in localStorage |
| External API | OpenAI (counts as the required integration) | brief lists OpenAI as a valid option |
| Deploy | Vercel | required by brief |

> **Heads up**: Next.js 16 has breaking changes vs older training data. Always read the relevant guide in `node_modules/next/dist/docs/` before writing code that touches Next.js internals (routing, params, server actions, etc.).

## Commands

```bash
npm run dev          # local dev server on http://localhost:3000
npm run build        # production build (run before pushing)
npm run start        # serve production build
npm run lint         # ESLint check
npm run typecheck    # tsc --noEmit (must pass before commit)
```

If `typecheck` is not in `package.json` yet, add: `"typecheck": "tsc --noEmit"`.

## Project Structure

This project does **NOT** use a `src/` folder — everything lives at the repo root. The `@/*` alias points to the root.

```
app/
├── api/
│   ├── chat/
│   │   └── route.ts              # POST: streaming chat endpoint with tools
│   └── sessions/
│       └── [id]/
│           └── messages/
│               └── route.ts      # GET: load chat history
├── layout.tsx                    # root layout, metadata (SEO)
├── page.tsx                      # main chat page
└── globals.css                   # Tailwind v4 + shadcn CSS vars
components/
├── ui/                           # shadcn-generated, do not edit by hand
└── chat/
    ├── ChatContainer.tsx         # main container, uses useChat hook
    ├── MessageList.tsx           # scrollable message list with auto-scroll
    ├── Message.tsx               # single message bubble (user/assistant/tool)
    ├── ChatInput.tsx             # input + send button
    ├── TypingIndicator.tsx       # dots animation while streaming
    └── ToolInvocation.tsx        # renders when agent uses a tool
lib/
├── ai/
│   ├── tools.ts                  # all agent tools (getCompanyInfo, saveLead, handoffToHuman)
│   ├── system-prompt.ts          # system prompt as a constant
│   └── model.ts                  # model config (centralized)
├── db/                           # stage 6
│   └── firebase.admin.ts         # Admin SDK for route handlers
├── utils.ts                      # cn() helper from shadcn
└── logger.ts                     # structured JSON logger
data/
└── company-info.json             # mock CallBotIA info consumed by getCompanyInfo
```

Message types come from the SDK (`UIMessage` from `ai`). There is no `types/chat.ts` — the previous custom type was removed when migrating to the v6 message shape.

## Environment Variables

All required vars are documented in `.env.example`. Never commit `.env.local`. The `.gitignore` is configured so `.env*` is ignored EXCEPT `.env.example` (which is the template).

| Variable | Used in | Required |
|----------|---------|----------|
| `OPENAI_API_KEY` | server | yes |
| `FIREBASE_PROJECT_ID` | admin SDK (stage 6) | yes |
| `FIREBASE_CLIENT_EMAIL` | admin SDK (stage 6) | yes |
| `FIREBASE_PRIVATE_KEY` | admin SDK, escape `\n` (stage 6) | yes |

When adding a new var, update `.env.example` in the same commit.

## Key Architectural Decisions

### Why OpenAI over Ollama (Option B over Option A)
- Vercel is serverless; Ollama requires a persistent process with the model loaded in RAM.
- Hosting Ollama externally (Fly.io, Railway with GPU) adds infra complexity not justified for this scope.
- GPT-4o-mini has superior tool calling and costs cents for the entire demo.
- Documented in README as a conscious decision, not a default.

### Why monorepo (frontend + API in same Next.js app) over separate backend
- Single deploy target (Vercel) simplifies CI/CD.
- Route Handlers are first-class in App Router.
- Edge runtime available for low-latency streaming.
- Can split later if backend grows (premature optimization avoided).

### Why Firebase Firestore over Postgres
- Bonus point in the brief.
- Document model fits conversational data naturally (session → messages subcollection).
- SDK handles real-time out of the box if needed later.
- Tradeoff acknowledged: would migrate to Postgres for complex analytical queries in v2.

### Why Vercel AI SDK over custom streaming
- Production-grade SSE handling with reconnection and cancellation.
- `useChat` hook in React handles streaming state, tool invocations, errors.
- Reduces hundreds of lines of boilerplate.

### Why server-only DB writes
- Even though Firestore Client SDK can write directly, all writes go through API routes.
- Reasons: enforce validation with Zod, keep security rules simple (deny client writes), centralize logging.

### Why no `src/` folder
- Next.js allows both layouts; this project keeps `app/`, `components/`, `lib/` at the root (default scaffold from Vercel deploy).
- The `@/*` alias resolves from the repo root accordingly.

## Code Conventions

- **TypeScript**: no `any`. Use `unknown` + Zod validation at boundaries. `noUncheckedIndexedAccess` is enabled — handle `undefined` when reading array indexes or object keys.
- **Imports**: use `@/` alias for everything inside the repo. Never relative imports beyond one level.
- **Components**: server components by default. Add `"use client"` only when needed (hooks, events, browser APIs).
- **Naming**: PascalCase for components, camelCase for functions and variables, kebab-case for file paths only when shadcn dictates it.
- **Error handling**: never swallow errors. Log with structured logger, surface to user with a toast (Sonner).
- **Async**: prefer async/await over `.then()` chains.
- **Comments**: explain "why", not "what". Code should be self-explanatory.

## Do's and Don'ts

### Do
- Validate all API inputs with Zod schemas.
- Log each tool invocation with `{ tool, params, durationMs, sessionId }`.
- Use `streamText` from `ai` package (not raw `fetch` to OpenAI).
- Update `.env.example` whenever a new env var is added.
- Run `npm run typecheck && npm run lint` before declaring a task done.
- Use shadcn components (`npx shadcn@latest add <name>`) instead of building from scratch.
- Keep the system prompt in `lib/ai/system-prompt.ts` for easy iteration.

### Don't
- Don't add new dependencies without justification. We already have Tailwind, shadcn, AI SDK v6, Zod, and Firebase Admin (stage 6). Almost anything else is overkill.
- Don't install icon libraries beyond Lucide (it ships with shadcn).
- Don't write SQL or set up Postgres. We use Firestore.
- Don't add authentication unless explicitly requested. Use `sessionId` in localStorage.
- Don't use WebSockets. Streaming uses SSE via the AI SDK.
- Don't hardcode API keys. Always read from `process.env`.
- Don't use `localStorage` directly inside React Server Components; wrap in a client component.
- Don't create files in `app/api/` other than `route.ts`, `route.test.ts`, or middleware.
- Don't introduce a `src/` folder — keep the current root layout.

## Agent Tools (current)

All tools live in `lib/ai/tools.ts`. AI SDK v6 uses `inputSchema` (NOT `parameters`):

```ts
import { tool } from 'ai';
import { z } from 'zod';

export const toolName = tool({
  description: 'Concise description that helps the model decide WHEN to use this',
  inputSchema: z.object({
    param: z.string().describe('what this param means'),
  }),
  execute: async ({ param }) => {
    // 1. Capture start timestamp
    // 2. Do work
    // 3. log('info', 'tool.<name>', { ...params, durationMs })
    // 4. Return a plain JSON-serializable object
    return { status: 'ok', data: '...' };
  },
});
```

Implemented tools:
- `getCompanyInfo` — returns sliced data from `data/company-info.json` (services, pricing, contact, faq, overview)
- `saveLead` — captures a prospect; logs only in stage 5, will write to Firestore in stage 6
- `handoffToHuman` — simulates agent handoff (explicit brief requirement)

When implementing a new tool, also add a sample prompt that triggers it to the README's "Demo prompts" section.

## Current Status

- [x] Etapa 1: Project foundations (TS strict + `noUncheckedIndexedAccess`, shadcn init with `radix-nova` preset, chat components installed)
- [x] Etapa 2: Chat UI with mock data
- [x] Etapa 3: Basic OpenAI integration (`generateText`)
- [x] Etapa 4: Streaming with `useChat` hook (SDK v6: `streamText` + `toUIMessageStreamResponse`)
- [x] Etapa 5: Agentic tools (`getCompanyInfo`, `saveLead`, `handoffToHuman`) + tool invocation chips in UI
- [ ] Etapa 6: Firestore persistence (sessions/{id}/messages + leads collection)
- [ ] Etapa 8 (recortada): Markdown rendering, mobile check, error handling polish
- [ ] Etapa 9: Deploy + README + architecture diagram (CRITICAL — do not skip)

When completing a stage, check the box here and commit with a descriptive message.

## Bonus Points Targeted

From the brief's bonus list, prioritized by value/effort given the 2-day window:

- **Realtime streaming** — covered by Vercel AI SDK (done)
- **Firebase** — stage 6 (sessionId-based persistence)
- **Logs & observabilidad** — structured JSON logs already in place via `lib/logger.ts`
- ~~SEO técnico extra~~ — basic metadata only; sitemap/robots skipped for time
- ~~Docker~~ — skipped, deploy goes straight to Vercel
- ~~RAG / Vector DB~~ — skipped, high effort
- ~~Cloudflare~~ — redundant with Vercel
- ~~Voice AI~~ — skipped, high risk for the time available

## Reference Documentation

When unsure about an API, prefer these sources in order:
1. `node_modules/next/dist/docs/` (this Next.js version has breaking changes vs older training data)
2. `docs.anthropic.com` / `docs.openai.com`
3. `sdk.vercel.ai/docs`
4. `ui.shadcn.com/docs`
5. `firebase.google.com/docs`

Do not paste large doc excerpts into code. Link them in commit messages if needed for justification.

## Demo Prompts (for evaluation)

These prompts exercise each tool and the agentic behavior:

- "¿Qué servicios ofrece CallBotIA?" → triggers `getCompanyInfo` (topic=services)
- "¿Cuánto cuesta el plan Business?" → triggers `getCompanyInfo` (topic=pricing)
- "¿Cómo los contacto?" → triggers `getCompanyInfo` (topic=contact)
- "Me interesa contratar, soy Pablo, pablo@test.com, quiero el plan Business" → triggers `saveLead`
- "Quiero hablar con una persona" → triggers `handoffToHuman`
- "Cuáles son los planes y después agendame, soy Ana ana@test.com" → multi-step: `getCompanyInfo` + `saveLead`

Add these to the README so the reviewer can test quickly.
