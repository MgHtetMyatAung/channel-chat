/** @jsxImportSource chat */
import { Chat, Card, CardText, Actions, Button } from "chat";
import { createTelegramAdapter } from "@chat-adapter/telegram";
import { createRedisState } from "@chat-adapter/state-redis";
import { createMemoryState } from "@chat-adapter/state-memory";

let botInstance: Chat<any, any> | null = null;

export function getBot() {
  if (botInstance) return botInstance;

  // Log env var presence (not values) to help debug Vercel issues
  console.log("[Bot] Environment check:", {
    hasBotToken: !!process.env.TELEGRAM_BOT_TOKEN,
    hasBotUsername: !!process.env.TELEGRAM_BOT_USERNAME,
    botUsername: process.env.TELEGRAM_BOT_USERNAME ?? "(missing!)",
    hasSecretToken: !!process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN,
    hasRedisUrl: !!process.env.REDIS_URL,
  });

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const botUsername = process.env.TELEGRAM_BOT_USERNAME;
  const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN;

  if (!botToken) {
    throw new Error("[Bot] TELEGRAM_BOT_TOKEN is not set in environment variables!");
  }

  // Clean the Redis URL to remove accidental quotes from Vercel dashboard
  const rawUrl = process.env.REDIS_URL?.replace(/['"]/g, "");
  const isUrlValid = !!(rawUrl?.startsWith("redis"));

  botInstance = new Chat({
    userName: botUsername!,
    adapters: {
      // Explicitly pass all config to avoid env var parsing issues
      telegram: createTelegramAdapter({
        botToken,
        secretToken,
        userName: botUsername,
        mode: "webhook",
      }),
    },
    state: isUrlValid
      ? createRedisState({ url: rawUrl })
      : createMemoryState(),
  });

  // Handle @mentions in Groups and Channels
  botInstance.onNewMention(async (thread, message) => {
    console.log(`[Bot] onNewMention fired — thread: ${thread.id}, text: "${message.text}"`);
    await thread.subscribe();
    await thread.post(
      <Card title="Hello!">
        <CardText>{`I am now listening. You said: **${message.text}**`}</CardText>
        <Actions>
          <Button id="help">Show Commands</Button>
        </Actions>
      </Card>
    );
  });

  // Handle Direct Messages (DMs)
  botInstance.onDirectMessage(async (thread, message) => {
    console.log(`[Bot] onDirectMessage fired — from: ${message.author?.userName}, text: "${message.text}"`);
    await thread.subscribe();
    await thread.post(
      <Card title="Direct Message">
        <CardText>{`Hello! You said: "${message.text}". I'll keep listening here.`}</CardText>
      </Card>
    );
  });

  // Handle follow-up messages in subscribed threads
  botInstance.onSubscribedMessage(async (thread, message) => {
    console.log(`[Bot] onSubscribedMessage fired — thread: ${thread.id}, text: "${message.text?.slice(0, 30)}"`);
    const text = message.text?.toLowerCase() || "";

    if (text === "exit" || text === "/stop") {
      await thread.unsubscribe();
      await thread.post("Bot unsubscribed. Mention me again to restart.");
      return;
    }

    if (text === "/help" || text === "help") {
      await thread.post(
        <Card title="Available Commands">
          <CardText>
            {`- **help** / **/help** — Show this menu\n- **exit** / **/stop** — Unsubscribe bot\n- Any other text — I'll echo it back`}
          </CardText>
        </Card>
      );
      return;
    }

    await thread.post(`Echo: ${message.text}`);
  });

  return botInstance;
}
