import { bot } from "@/lib/bot";
import { after } from "next/server";

export async function POST(req: Request) {
  try {
    // Passing the request to the adapter
    // 'after' ensures the bot finishes work after the response is sent
    return await bot.webhooks.telegram(req, {
      waitUntil: (task) => after(() => task),
    });
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }
}
