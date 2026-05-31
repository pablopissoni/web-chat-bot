import { getMessages } from "@/lib/db/sessions";
import { log } from "@/lib/logger";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || id.length > 64) {
    return Response.json({ error: "Invalid session id" }, { status: 400 });
  }

  try {
    const messages = await getMessages(id);
    return Response.json({ messages });
  } catch (err) {
    log("error", "sessions.getMessages.failed", {
      sessionId: id,
      error: (err as Error).message,
    });
    return Response.json(
      { error: "Failed to load messages" },
      { status: 500 }
    );
  }
}
