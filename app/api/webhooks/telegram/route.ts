import { getBot } from "@/lib/bot";
import { after } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("[Telegram Webhook] Received POST request");
    
    const bot = getBot();
    
    // Check if we have the secret token for verification
    const secretFromHeader = req.headers.get("x-telegram-bot-api-secret-token");
    console.log("[Telegram Webhook] Secret header present:", !!secretFromHeader);

    const response = await bot.webhooks.telegram(req, {
      waitUntil: (task) => after(async () => {
        try {
          await task;
          console.log("[Telegram Webhook] Task completed successfully");
        } catch (error) {
          console.error("[Telegram Webhook] Task failed:", error);
        }
      }),
    });

    console.log("[Telegram Webhook] Adapter responded with status:", response.status);
    return response;
  } catch (error) {
    console.error("[Telegram Webhook] Critical Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
