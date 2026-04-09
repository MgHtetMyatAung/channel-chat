/** @jsxImportSource chat */
import { Chat, Card, CardText, Actions, Button } from "chat";
import { createTelegramAdapter } from "@chat-adapter/telegram";
import { createRedisState } from "@chat-adapter/state-redis";
import { createMemoryState } from "@chat-adapter/state-memory";

let botInstance: Chat<any, any> | null = null;

export function getBot() {
  if (botInstance) return botInstance;

  // Clean the URL to remove accidental quotes from Vercel dashboard
  const rawUrl = process.env.REDIS_URL;
  const cleanUrl = rawUrl?.replace(/['"]/g, "");
  const isUrlValid = !!(cleanUrl?.startsWith("redis"));

  botInstance = new Chat({
    userName: process.env.TELEGRAM_BOT_USERNAME || "bot",
    adapters: {
      telegram: createTelegramAdapter(),
    },
    // Only use Redis if a valid URL is provided. 
    // This prevents build-time crashes on Vercel.
    state: isUrlValid ? createRedisState({ url: cleanUrl }) : createMemoryState(),
  });

  // Handle @mentions in Groups and Channels
  botInstance.onNewMention(async (thread, message) => {
    console.log(`[Bot] New mention received in thread: ${thread.id}`);
    await thread.subscribe();
    await thread.post(
      <Card title="Hello Group!">
        <CardText>{`I am now listening to this channel. You said: **${message.text}**`}</CardText>
        <Actions>
          <Button id="help">Show Commands</Button>
        </Actions>
      </Card>
    );
  });

  // Handle Direct Messages (DMs)
  botInstance.onDirectMessage(async (thread, message) => {
    console.log(`[Bot] DM received from: ${message.author?.userName}`);
    await thread.subscribe();
    await thread.post(
      <Card title="Direct Message Active">
        <CardText>{`Hello! I&apos;ve subscribed to our DM. You said: "${message.text}". I&apos;ll respond to your messages here.`}</CardText>
      </Card>
    );
  });

  // Handle follow-up messages in any subscribed thread
  botInstance.onSubscribedMessage(async (thread, message) => {
    console.log(`[Bot] Subscribed message in ${thread.id}: ${message.text?.slice(0, 20)}`);
    const text = message.text?.toLowerCase() || "";
    
    if (text === "exit" || text === "/stop") {
      await thread.unsubscribe();
      await thread.post("Subscription ended. I'll stop responding until mentioned again.");
      return;
    }

    if (text === "/help" || text === "help") {
      await thread.post(
        <Card title="Available Commands">
          <CardText>
            {`- **help**: Show this menu\n- **exit**: Unsubscribe the bot\n- **ANY TEXT**: I'll echo it back!`}
          </CardText>
        </Card>
      );
      return;
    }
    
    await thread.post(`Continuing conversation: ${message.text}`);
  });

  return botInstance;
}
