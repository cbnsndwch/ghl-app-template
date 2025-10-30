# @cbnsndwch/ghl-sdk-webhooks

Webhook utilities for GHL SDK - framework-agnostic with adapters for popular frameworks.

[![Sponsor cbnsndwch](https://img.shields.io/badge/Sponsor-%E2%9D%A4-red?logo=github)](https://github.com/sponsors/cbnsndwch)

## Installation

```bash
pnpm add @cbnsndwch/ghl-sdk-webhooks @cbnsndwch/ghl-sdk-storage-memory
# or
pnpm add @cbnsndwch/ghl-sdk-webhooks @cbnsndwch/ghl-sdk-storage-mongodb mongodb
```

## Usage

### With Express

```typescript
import express from 'express';
import { WebhookManager } from '@cbnsndwch/ghl-sdk-webhooks';
import { createExpressMiddleware } from '@cbnsndwch/ghl-sdk-webhooks/adapters/express';
import { MemorySessionStorage } from '@cbnsndwch/ghl-sdk-storage-memory';

// Create storage
const storage = new MemorySessionStorage();
await storage.init();
storage.setClientId(process.env.GHL_CLIENT_ID);

// Create webhook manager
const webhookManager = new WebhookManager({
  clientId: process.env.GHL_CLIENT_ID,
  clientSecret: process.env.GHL_CLIENT_SECRET,
  publicKey: process.env.WEBHOOK_PUBLIC_KEY,
  storage,
});

// Add custom handlers
webhookManager.on('INSTALL', async (context) => {
  console.log('App installed:', context.event);
});

webhookManager.on('UNINSTALL', async (context) => {
  console.log('App uninstalled:', context.event);
});

// Use with Express
const app = express();
app.use(express.json());
app.post('/webhooks', createExpressMiddleware(webhookManager));
app.listen(3000);
```

### Framework-Agnostic Usage

```typescript
import { WebhookManager } from '@cbnsndwch/ghl-sdk-webhooks';
import { MongoDBSessionStorage } from '@cbnsndwch/ghl-sdk-storage-mongodb';

const storage = new MongoDBSessionStorage('mongodb://...', 'db');
await storage.init();
storage.setClientId(process.env.GHL_CLIENT_ID);

const webhookManager = new WebhookManager({
  clientId: process.env.GHL_CLIENT_ID,
  clientSecret: process.env.GHL_CLIENT_SECRET,
  publicKey: process.env.WEBHOOK_PUBLIC_KEY,
  storage,
});

// Process webhook manually
const event = {
  type: 'INSTALL',
  appId: 'your-app-id',
  companyId: 'company-123',
  // ... other fields
};

const context = await webhookManager.process(event, signature);
console.log('Webhook processed:', context);
```

## Features

- ✅ Framework-agnostic core
- ✅ Express adapter included
- ✅ Automatic signature verification
- ✅ Default INSTALL/UNINSTALL handlers
- ✅ Custom event handlers
- ✅ ESM-only
- ✅ Full TypeScript support

## API

### WebhookManager

#### Constructor

```typescript
new WebhookManager({
  clientId: string;
  clientSecret: string;
  publicKey?: string; // Optional, for signature verification
  storage: ISessionStorage;
})
```

#### Methods

- `on(eventType, handler)` - Register a custom event handler
- `process(event, signature?)` - Process a webhook event

### createExpressMiddleware

```typescript
createExpressMiddleware(manager: WebhookManager)
```

Returns Express middleware that:

- Extracts webhook event from `req.body`
- Extracts signature from `x-wh-signature` header
- Processes the event through the manager
- Attaches `webhookContext` to the request
- Sends appropriate HTTP response

## Custom Event Handlers

```typescript
webhookManager.on('INSTALL', async (context) => {
  const { event, signatureVerified } = context;
  
  // Your custom logic
  console.log('Install event:', event);
  
  // Access storage
  await storage.setSession(event.companyId, {
    access_token: 'token',
    // ... other session data
  });
});
```

## License

MIT
