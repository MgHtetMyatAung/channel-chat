/** @jsxImportSource chat */
import { Chat, Card, CardText, Actions, Button } from "chat";
import { createTelegramAdapter } from "@chat-adapter/telegram";
import { createRedisState } from "@chat-adapter/state-redis";
import { createMemoryState } from "@chat-adapter/state-memory";

export const bot = new Chat({
  userName: process.env.TELEGRAM_BOT_USERNAME || "bot",
  adapters: {
    telegram: createTelegramAdapter(),
  },
  // Use Redis in production, fallback to Memory during build or local dev
  state: process.env.REDIS_URL ? createRedisState() : createMemoryState(),
});

// Handle @mentions in Groups and Channels
bot.onNewMention(async (thread, message) => {
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
bot.onDirectMessage(async (thread, message) => {
  await thread.subscribe();
  await thread.post(
    <Card title="Direct Message Active">
      <CardText>{`Hello! I&apos;ve subscribed to our DM. You said: "${message.text}". I&apos;ll respond to your messages here.`}</CardText>
    </Card>
  );
});

// Handle follow-up messages in any subscribed thread
bot.onSubscribedMessage(async (thread, message) => {
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
          {`- **help**: Show this menu\n- **exit**: Unsubscribe the bot from this chat\n- **ANY TEXT**: I'll echo it back!`}
        </CardText>
      </Card>
    );
    return;
  }
  
  await thread.post(`Continuing conversation: ${message.text}`);
});

// Note: bot.initialize() is omitted here as it is called automatically by bot.webhooks.telegram()
