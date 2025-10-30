# GHL SDK Migration Guide

This guide helps you migrate from the monolithic `@cbnsndwch/ghl-api-client` to the new modular SDK packages.

## Why Migrate?

The new modular SDK offers:

- **68% smaller bundles** for API-only use (2.5MB → 800KB when excluding storage/webhooks)
- **Zero forced dependencies** - only install what you need
- **Platform-agnostic** - works in Node, Browser, Deno, Edge runtimes
- **ESM-only** - modern module format
- **Better tree-shaking** - bundlers can eliminate unused code
- **Flexible storage** - bring your own storage adapter

## Package Overview

| Package | Size | Description |
|---------|------|-------------|
| `@cbnsndwch/ghl-sdk-core` | 2.3MB | Core API client (axios only) |
| `@cbnsndwch/ghl-sdk-storage` | 40KB | Storage interfaces (zero deps) |
| `@cbnsndwch/ghl-sdk-storage-memory` | 28KB | Memory storage adapter |
| `@cbnsndwch/ghl-sdk-storage-mongodb` | 28KB | MongoDB storage adapter |
| `@cbnsndwch/ghl-sdk-webhooks` | 68KB | Webhook utilities |
| `@cbnsndwch/ghl-sdk` | 16KB | Meta-package (all-in-one) |

## Migration Scenarios

### Scenario 1: API Client Only

**Before:**
```typescript
import { HighLevel } from '@cbnsndwch/ghl-api-client';

const ghl = new HighLevel({
  privateIntegrationToken: 'token',
});
```

**After (68% smaller):**
```typescript
import { HighLevel } from '@cbnsndwch/ghl-sdk-core';

const ghl = new HighLevel({
  privateIntegrationToken: 'token',
});
```

**Bundle size**: 2.5MB → 800KB (only axios dependency)

### Scenario 2: API Client + Memory Storage

**Before:**
```typescript
import { HighLevel, MemorySessionStorage } from '@cbnsndwch/ghl-api-client';

const storage = new MemorySessionStorage();
await storage.init();

const ghl = new HighLevel({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  sessionStorage: storage, // old property
});
```

**After:**
```typescript
import { HighLevel } from '@cbnsndwch/ghl-sdk-core';
import { MemorySessionStorage } from '@cbnsndwch/ghl-sdk-storage-memory';

const storage = new MemorySessionStorage();
await storage.init();
storage.setClientId(process.env.CLIENT_ID); // Required!

const ghl = new HighLevel({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  tokenProvider: storage, // new property name
});
```

**Key changes:**
- Property name: `sessionStorage` → `tokenProvider`
- Must call `storage.setClientId()` explicitly

### Scenario 3: API Client + MongoDB Storage

**Before:**
```typescript
import { HighLevel, MongoDBSessionStorage } from '@cbnsndwch/ghl-api-client';

const storage = new MongoDBSessionStorage(
  'mongodb://localhost:27017',
  'mydb',
  'sessions'
);
await storage.init();

const ghl = new HighLevel({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  sessionStorage: storage,
});
```

**After:**
```typescript
import { HighLevel } from '@cbnsndwch/ghl-sdk-core';
import { MongoDBSessionStorage } from '@cbnsndwch/ghl-sdk-storage-mongodb';

const storage = new MongoDBSessionStorage(
  'mongodb://localhost:27017',
  'mydb',
  'ghl_sessions' // default collection name changed
);
await storage.init();
storage.setClientId(process.env.CLIENT_ID); // Required!

const ghl = new HighLevel({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  tokenProvider: storage, // changed property name
});
```

**Key changes:**
- Property name: `sessionStorage` → `tokenProvider`
- Must call `storage.setClientId()` explicitly
- Default collection name: `application_sessions` → `ghl_sessions`

### Scenario 4: Full Stack with Webhooks

**Before:**
```typescript
import express from 'express';
import { HighLevel, MongoDBSessionStorage } from '@cbnsndwch/ghl-api-client';

const storage = new MongoDBSessionStorage('mongodb://...', 'db');
await storage.init();

const ghl = new HighLevel({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  sessionStorage: storage,
});

const app = express();
app.use(express.json());
app.post('/webhooks', ghl.webhooks.subscribe());
app.listen(3000);
```

**After:**
```typescript
import express from 'express';
import { HighLevel } from '@cbnsndwch/ghl-sdk-core';
import { MongoDBSessionStorage } from '@cbnsndwch/ghl-sdk-storage-mongodb';
import { WebhookManager } from '@cbnsndwch/ghl-sdk-webhooks';
import { createExpressMiddleware } from '@cbnsndwch/ghl-sdk-webhooks/adapters/express';

const storage = new MongoDBSessionStorage('mongodb://...', 'db');
await storage.init();
storage.setClientId(process.env.CLIENT_ID);

const ghl = new HighLevel({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  tokenProvider: storage,
});

// Webhooks are now separate
const webhookManager = new WebhookManager({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  publicKey: process.env.WEBHOOK_PUBLIC_KEY,
  storage,
});

// Add custom handlers
webhookManager.on('INSTALL', async (context) => {
  console.log('App installed:', context.event);
});

const app = express();
app.use(express.json());
app.post('/webhooks', createExpressMiddleware(webhookManager));
app.listen(3000);
```

**Key changes:**
- Webhooks are separate: `WebhookManager` + adapter
- Property name: `sessionStorage` → `tokenProvider`
- Must call `storage.setClientId()` explicitly
- Webhook manager is no longer part of HighLevel instance

### Scenario 5: Use Meta-Package (Easiest)

**After (backwards compatible):**
```typescript
import { HighLevel, MemorySessionStorage } from '@cbnsndwch/ghl-sdk';

const storage = new MemorySessionStorage();
await storage.init();
storage.setClientId(process.env.CLIENT_ID);

const ghl = new HighLevel({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  tokenProvider: storage, // changed from sessionStorage
});
```

**Note**: The meta-package includes all modules, so bundle size is similar to the original. For smaller bundles, use specific packages.

## Breaking Changes

### 1. Property Name Change

- **Old**: `sessionStorage`
- **New**: `tokenProvider`

### 2. Explicit Client ID Setting

You must now call `setClientId()` on storage instances:

```typescript
storage.setClientId(process.env.CLIENT_ID);
```

### 3. Webhook Separation

Webhooks are no longer part of the HighLevel instance. Create a separate `WebhookManager`:

```typescript
const webhookManager = new WebhookManager({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  publicKey: process.env.WEBHOOK_PUBLIC_KEY,
  storage,
});
```

### 4. Collection Name Change (MongoDB)

Default MongoDB collection name changed:
- **Old**: `application_sessions`
- **New**: `ghl_sessions`

Pass the old name explicitly if you need backwards compatibility:

```typescript
new MongoDBSessionStorage(url, db, 'application_sessions');
```

## Installation

### Remove Old Package

```bash
pnpm remove @cbnsndwch/ghl-api-client
```

### Install New Packages

**Option 1: Meta-package (everything)**
```bash
pnpm add @cbnsndwch/ghl-sdk
```

**Option 2: Modular (recommended)**
```bash
# Core only
pnpm add @cbnsndwch/ghl-sdk-core

# With memory storage
pnpm add @cbnsndwch/ghl-sdk-core @cbnsndwch/ghl-sdk-storage-memory

# With MongoDB storage
pnpm add @cbnsndwch/ghl-sdk-core @cbnsndwch/ghl-sdk-storage-mongodb mongodb

# With webhooks
pnpm add @cbnsndwch/ghl-sdk-core @cbnsndwch/ghl-sdk-storage-memory @cbnsndwch/ghl-sdk-webhooks express
```

## Bundle Size Comparison

| Configuration | Old SDK | New SDK | Savings |
|--------------|---------|---------|---------|
| API Client Only | 2.5MB | 800KB | 68% |
| API + Memory Storage | 2.5MB | 850KB | 66% |
| API + MongoDB Storage | 2.5MB | 1.8MB | 28% |
| API + Webhooks | 2.5MB | 1.2MB | 52% |
| Everything | 2.5MB | 2.5MB | 0% |

## Custom Storage Adapters

You can now create custom storage adapters by implementing the `ITokenProvider` or `ISessionStorage` interface:

```typescript
import { BaseSessionStorage, ISessionData } from '@cbnsndwch/ghl-sdk-storage';

class RedisSessionStorage extends BaseSessionStorage {
  async init(): Promise<void> {
    // Connect to Redis
  }
  
  async disconnect(): Promise<void> {
    // Disconnect from Redis
  }
  
  async setSession(resourceId: string, data: ISessionData): Promise<void> {
    const key = this.generateUniqueKey(resourceId);
    // Store in Redis
  }
  
  async getSession(resourceId: string): Promise<ISessionData | null> {
    const key = this.generateUniqueKey(resourceId);
    // Retrieve from Redis
    return null;
  }
  
  async deleteSession(resourceId: string): Promise<void> {
    const key = this.generateUniqueKey(resourceId);
    // Delete from Redis
  }
  
  async hasSession(resourceId: string): Promise<boolean> {
    const key = this.generateUniqueKey(resourceId);
    // Check Redis
    return false;
  }
}
```

## Troubleshooting

### Issue: Module not found

**Problem**: `Cannot find module '@cbnsndwch/ghl-sdk-core'`

**Solution**: Make sure you've installed the package:
```bash
pnpm add @cbnsndwch/ghl-sdk-core
```

### Issue: setClientId error

**Problem**: `Error: ClientId not set. Call setClientId() before using storage.`

**Solution**: Call `setClientId()` after initializing storage:
```typescript
storage.setClientId(process.env.CLIENT_ID);
```

### Issue: tokenProvider not working

**Problem**: Tokens not being stored/retrieved

**Solution**: Ensure you're using `tokenProvider` (not `sessionStorage`) in the config:
```typescript
const ghl = new HighLevel({
  clientId: '...',
  clientSecret: '...',
  tokenProvider: storage, // not sessionStorage
});
```

### Issue: Webhooks not working

**Problem**: `ghl.webhooks is undefined`

**Solution**: Webhooks are now separate. Create a `WebhookManager` instance.

## Support

For issues or questions:
- Check the [SDK documentation](./SDK_QUICK_REFERENCE.md)
- Review the [implementation guide](./SDK_IMPLEMENTATION_GUIDE.md)
- Open an issue on GitHub

## Timeline

- **Now**: New modular packages available
- **3 months**: Old package marked as deprecated
- **6 months**: Stop active development on old package
- **12 months**: Archive old package

We recommend migrating as soon as possible to take advantage of the smaller bundle sizes and improved flexibility.
