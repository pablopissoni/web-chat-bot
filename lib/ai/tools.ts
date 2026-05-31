import { tool } from "ai";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import companyInfo from "@/data/company-info.json";
import { adminDb } from "@/lib/db/firebase.admin";
import { log } from "@/lib/logger";

function getSessionId(context: unknown): string | undefined {
  if (context && typeof context === "object" && "sessionId" in context) {
    const id = (context as { sessionId?: unknown }).sessionId;
    return typeof id === "string" ? id : undefined;
  }
  return undefined;
}

/**
 * getCompanyInfo
 * Lets the agent look up structured information about CallBotIA (services, pricing, contact, FAQ).
 * The "topic" param tells the model what slice of the JSON to return so it does not have to memorize.
 */
export const getCompanyInfo = tool({
  description:
    "Obtiene información oficial de CallBotIA. Usá esta herramienta cuando el usuario pregunte por servicios, precios, planes, contacto, horarios o preguntas frecuentes. NUNCA inventes esta información, siempre consultala con esta tool.",
  inputSchema: z.object({
    topic: z
      .enum(["services", "pricing", "contact", "faq", "overview"])
      .describe(
        "Qué información traer. 'overview' devuelve nombre + descripción general. Usá el que mejor matchee la pregunta del usuario."
      ),
  }),
  execute: async ({ topic }) => {
    const start = Date.now();

    let data: unknown;
    switch (topic) {
      case "overview":
        data = {
          company: companyInfo.company,
          tagline: companyInfo.tagline,
          description: companyInfo.description,
        };
        break;
      case "services":
        data = companyInfo.services;
        break;
      case "pricing":
        data = companyInfo.pricing;
        break;
      case "contact":
        data = companyInfo.contact;
        break;
      case "faq":
        data = companyInfo.faq;
        break;
    }

    log("info", "tool.getCompanyInfo", {
      topic,
      durationMs: Date.now() - start,
    });

    return data;
  },
});

/**
 * saveLead
 * Captures a prospect interested in CallBotIA's services.
 * For now logs and returns a confirmation; in stage 6 this will write to Firestore.
 */
export const saveLead = tool({
  description:
    "Guarda los datos de un usuario interesado en contratar los servicios de CallBotIA. Solo invocá esta tool cuando el usuario haya dado explícitamente su nombre Y su email Y haya mostrado intención de contratar. Si falta alguno, pedíselo primero en lenguaje natural.",
  inputSchema: z.object({
    name: z.string().min(1).describe("Nombre completo del interesado."),
    email: z.string().email().describe("Email del interesado, debe ser válido."),
    interest: z
      .string()
      .describe(
        "Qué servicio o plan le interesa, en una o dos oraciones. Resumí lo que dijo el usuario, no inventes."
      ),
  }),
  execute: async ({ name, email, interest }, options) => {
    const start = Date.now();
    const leadId = crypto.randomUUID();
    const sessionId = getSessionId(options.experimental_context);

    try {
      await adminDb()
        .collection("leads")
        .doc(leadId)
        .set({
          sessionId: sessionId ?? null,
          name,
          email,
          interest,
          status: "new" as const,
          createdAt: FieldValue.serverTimestamp(),
        });
    } catch (err) {
      log("error", "tool.saveLead.dbWriteFailed", {
        leadId,
        error: (err as Error).message,
      });
      throw err;
    }

    log("info", "tool.saveLead", {
      leadId,
      sessionId,
      name,
      email,
      interest,
      durationMs: Date.now() - start,
    });

    return {
      status: "saved" as const,
      leadId,
      message:
        "Listo, registramos tu interés. El equipo de CallBotIA te va a contactar en menos de 24 hs hábiles.",
    };
  },
});

/**
 * handoffToHuman
 * Simulates escalating the conversation to a human agent.
 * Required by the brief: "Simular derivación de agentes".
 */
export const handoffToHuman = tool({
  description:
    "Deriva al usuario a un agente humano. Usá esta tool cuando: (a) el usuario pide explícitamente hablar con una persona, (b) el problema escapa de tus capacidades, (c) detectás frustración significativa, o (d) el caso es delicado (reclamo, problema de facturación, queja formal).",
  inputSchema: z.object({
    reason: z
      .string()
      .describe("Motivo de la derivación, en una oración."),
    urgency: z
      .enum(["low", "medium", "high"])
      .describe(
        "Urgencia. 'high' solo para casos urgentes o muy frustrados. 'medium' por defecto cuando el usuario pidió un humano."
      ),
  }),
  execute: async ({ reason, urgency }, options) => {
    const start = Date.now();
    const ticketId = crypto.randomUUID();
    const sessionId = getSessionId(options.experimental_context);

    try {
      await adminDb()
        .collection("handoffs")
        .doc(ticketId)
        .set({
          sessionId: sessionId ?? null,
          reason,
          urgency,
          status: "pending" as const,
          createdAt: FieldValue.serverTimestamp(),
        });
    } catch (err) {
      log("error", "tool.handoffToHuman.dbWriteFailed", {
        ticketId,
        error: (err as Error).message,
      });
      throw err;
    }

    log("info", "tool.handoffToHuman", {
      ticketId,
      sessionId,
      reason,
      urgency,
      durationMs: Date.now() - start,
    });

    return {
      status: "transferred" as const,
      ticketId,
      urgency,
      message:
        "Te derivé con un agente humano. En breve te van a contactar por este chat o por email.",
    };
  },
});

export const tools = {
  getCompanyInfo,
  saveLead,
  handoffToHuman,
};
