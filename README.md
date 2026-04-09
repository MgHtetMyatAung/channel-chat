# Channel Chat | Multi-Platform AI Bot

A unified chat bot built with [Chat SDK](https://github.com/vercel/chat) and [Next.js](https://nextjs.org).

## Features

- **Unified Logic**: Write your bot logic once and deploy across multiple platforms.
- **Multi-Platform Support**: Currently supports Telegram, with Discord, Slack, and WhatsApp support coming soon.
- **Serverless Ready**: Optimized for Next.js with `after()` for background processing.
- **Persistent State**: Powered by Redis for reliable multi-platform state management.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **SDK**: `chat` (Chat SDK)
- **Adapters**: `@chat-adapter/telegram`
- **State**: `@chat-adapter/state-redis`
- **Styling**: Tailwind CSS 4.0

## Getting Started

### Prerequisites

1. Create a bot via [BotFather](https://t.me/botfather) and get your **Token** and **Username**.
2. Set up a Redis instance (e.g., [Upstash](https://upstash.com)).

### Environment Variables

Create a `.env` file in the root directory:

```env
TELEGRAM_BOT_TOKEN='your_token'
TELEGRAM_BOT_USERNAME='your_username'
TELEGRAM_WEBHOOK_SECRET_TOKEN='some_secret'
REDIS_URL='your_redis_url'
```

### Installation

```bash
pnpm install
pnpm dev
```

### Webhook Configuration

Set your webhook URL to:
`https://your-domain.com/api/webhooks/telegram`

## Development

Bot logic is located in `lib/bot.ts`.
Webhook handlers are located in `app/api/webhooks/`.

## License

MIT
