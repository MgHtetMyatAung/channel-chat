import { getBot } from "@/lib/bot";
import { after } from "next/server";

export async function POST(req: Request) {
  try {
    const bot = getBot();
    return await bot.webhooks.telegram(req, {
      waitUntil: (task) => after(() => task),
    });
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }
}
