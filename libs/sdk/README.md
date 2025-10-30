# @cbnsndwch/ghl-sdk

Unified SDK for HighLevel - meta-package that includes all modular SDK components.

[![Sponsor cbnsndwch](https://img.shields.io/badge/Sponsor-%E2%9D%A4-red?logo=github)](https://github.com/sponsors/cbnsndwch)

## Installation

```bash
pnpm add @cbnsndwch/ghl-sdk
```

## What's Included

This meta-package includes:

- `@cbnsndwch/ghl-sdk-core` - Core API client
- `@cbnsndwch/ghl-sdk-storage` - Storage interfaces
- `@cbnsndwch/ghl-sdk-storage-memory` - Memory storage adapter
- `@cbnsndwch/ghl-sdk-webhooks` - Webhook utilities

## Usage

### Quick Start - API Client Only

```typescript
import { HighLevel } from '@cbnsndwch/ghl-sdk';

const ghl = new HighLevel({
  privateIntegrationToken: 'your-token',
});

const contacts = await ghl.contacts.searchContactsAdvanced({
  locationId: 'location-id',
  // ... search params
});
```

### With Storage

```typescript
import { HighLevel, MemorySessionStorage } from '@cbnsndwch/ghl-sdk';

const storage = new MemorySessionStorage();
await storage.init();
storage.setClientId(process.env.GHL_CLIENT_ID);

const ghl = new HighLevel({
  clientId: process.env.GHL_CLIENT_ID,
  clientSecret: process.env.GHL_CLIENT_SECRET,
  tokenProvider: storage,
});
```

### With Webhooks

```typescript
import express from 'express';
import { 
  HighLevel, 
  MemorySessionStorage,
  WebhookManager 
} from '@cbnsndwch/ghl-sdk';
import { createExpressMiddleware } from '@cbnsndwch/ghl-sdk/webhooks/adapters/express';

const storage = new MemorySessionStorage();
await storage.init();
storage.setClientId(process.env.GHL_CLIENT_ID);

const webhookManager = new WebhookManager({
  clientId: process.env.GHL_CLIENT_ID,
  clientSecret: process.env.GHL_CLIENT_SECRET,
  publicKey: process.env.WEBHOOK_PUBLIC_KEY,
  storage,
});

webhookManager.on('INSTALL', async (context) => {
  console.log('App installed:', context.event);
});

const app = express();
app.use(express.json());
app.post('/webhooks', createExpressMiddleware(webhookManager));
app.listen(3000);
```

## Tree-Shaking

While this package includes everything, modern bundlers can still tree-shake unused code. For the smallest possible bundle, import directly from specific packages:

```typescript
// Smallest bundle - core only (2.3MB)
import { HighLevel } from '@cbnsndwch/ghl-sdk-core';

// With memory storage (+28KB)
import { HighLevel } from '@cbnsndwch/ghl-sdk-core';
import { MemorySessionStorage } from '@cbnsndwch/ghl-sdk-storage-memory';

// With MongoDB storage (+28KB + mongodb)
import { HighLevel } from '@cbnsndwch/ghl-sdk-core';
import { MongoDBSessionStorage } from '@cbnsndwch/ghl-sdk-storage-mongodb';

// With webhooks (+68KB)
import { HighLevel } from '@cbnsndwch/ghl-sdk-core';
import { WebhookManager } from '@cbnsndwch/ghl-sdk-webhooks';
```

## Features

- ✅ Complete SDK in one package
- ✅ Backwards compatible with previous versions
- ✅ ESM-only for modern runtimes
- ✅ Full TypeScript support
- ✅ Tree-shakeable (when using modern bundlers)
- ✅ Works in Node, Browser, Deno, Edge runtimes

## Package Sizes

- Core API client: 2.3MB
- Storage interfaces: 40KB
- Memory adapter: 28KB
- MongoDB adapter: 28KB + mongodb dependency
- Webhooks: 68KB

Total when using everything: ~2.5MB (similar to original monolithic SDK)

## Migration from @cbnsndwch/ghl-api-client

This package maintains backwards compatibility. The main change:

**Before:**

```typescript
import { HighLevel, MongoDBSessionStorage } from '@cbnsndwch/ghl-api-client';

const ghl = new HighLevel({
  clientId: 'xxx',
  clientSecret: 'yyy',
  sessionStorage: storage, // old property name
});
```

**After:**

```typescript
import { HighLevel } from '@cbnsndwch/ghl-sdk';
import { MongoDBSessionStorage } from '@cbnsndwch/ghl-sdk-storage-mongodb';

const ghl = new HighLevel({
  clientId: 'xxx',
  clientSecret: 'yyy',
  tokenProvider: storage, // new property name
});
```

## Documentation

- [Core SDK](../sdk-core/README.md)
- [Storage](../sdk-storage/README.md)
- [Memory Storage](../sdk-storage-memory/README.md)
- [MongoDB Storage](../sdk-storage-mongodb/README.md)
- [Webhooks](../sdk-webhooks/README.md)

## License

MIT
