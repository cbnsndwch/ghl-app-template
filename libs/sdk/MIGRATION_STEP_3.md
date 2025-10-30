# Migration Step 3: Adapter Packages

## Goal
Create optional adapter packages for MongoDB storage and Express webhooks.

## Overview

These packages are **optional** and only installed by users who need them. They have peer dependencies on `@gohighlevel/core`.

## Package 1: @gohighlevel/storage-mongodb

### Structure

```
packages/storage-mongodb/
├── src/
│   ├── index.ts
│   └── MongoDBSessionStorage.ts
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── README.md
```

### Step-by-Step

#### 1. Create package.json

Create `packages/storage-mongodb/package.json`:

```json
{
  "name": "@gohighlevel/storage-mongodb",
  "version": "3.0.0",
  "description": "MongoDB session storage adapter for HighLevel API SDK",
  "author": "HighLevel",
  "license": "MIT",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./package.json": "./package.json"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "clean": "rimraf dist",
    "lint": "tsc --noEmit",
    "test": "echo \"Tests coming soon\""
  },
  "dependencies": {
    "mongodb": "^6.18.0"
  },
  "peerDependencies": {
    "@gohighlevel/core": "workspace:*"
  },
  "devDependencies": {
    "@gohighlevel/core": "workspace:*",
    "@types/node": "^20.0.0",
    "rimraf": "^5.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.3.0"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "keywords": [
    "highlevel",
    "gohighlevel",
    "mongodb",
    "storage",
    "session",
    "adapter"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/YOUR_USERNAME/ghl-api-sdk.git",
    "directory": "packages/storage-mongodb"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/ghl-api-sdk/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/ghl-api-sdk/tree/main/packages/storage-mongodb#readme"
}
```

#### 2. Create tsconfig.json

Create `packages/storage-mongodb/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true,
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"],
  "references": [
    {
      "path": "../core"
    }
  ]
}
```

#### 3. Create tsup.config.ts

Create `packages/storage-mongodb/tsup.config.ts`:

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  target: 'es2022',
  outDir: 'dist',
  external: ['@gohighlevel/core', 'mongodb'],
});
```

#### 4. Copy Source Files

Copy from the original repo:
- `lib/storage/mongodb-session-storage.ts` → `packages/storage-mongodb/src/MongoDBSessionStorage.ts`

#### 5. Update Imports

In `src/MongoDBSessionStorage.ts`, update imports:

```typescript
// Change this:
import { SessionStorage } from './session-storage';
import { ISessionData } from './interfaces';
import { Logger } from '../logging';

// To this:
import { SessionStorage, type ISessionData, Logger } from '@gohighlevel/core';
```

#### 6. Create src/index.ts

Create `packages/storage-mongodb/src/index.ts`:

```typescript
// Export MongoDB storage adapter
export { MongoDBSessionStorage } from './MongoDBSessionStorage';

// Re-export core types for convenience
export type { ISessionData, SessionStorage } from '@gohighlevel/core';
```

#### 7. Create README.md

Create `packages/storage-mongodb/README.md`:

```markdown
# @gohighlevel/storage-mongodb

MongoDB session storage adapter for HighLevel API SDK.

## Installation

```bash
npm install @gohighlevel/core @gohighlevel/storage-mongodb mongodb
# or
pnpm add @gohighlevel/core @gohighlevel/storage-mongodb mongodb
```

## Usage

```typescript
import { HighLevel } from '@gohighlevel/core';
import { MongoDBSessionStorage } from '@gohighlevel/storage-mongodb';

const storage = new MongoDBSessionStorage(
  'mongodb://localhost:27017',
  'ghl-sessions',
  'sessions' // collection name (optional)
);

await storage.init();

const client = new HighLevel({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  sessionStorage: storage
});

// Use the client...

// Clean up when done
await storage.disconnect();
```

## API

### `MongoDBSessionStorage`

#### Constructor

```typescript
constructor(
  dbUrl: string,
  dbName: string,
  collectionName?: string,
  logger?: Logger
)
```

#### Methods

- `init(): Promise<void>` - Initialize MongoDB connection
- `disconnect(): Promise<void>` - Close MongoDB connection
- `setClientId(clientId: string): void` - Set client ID (called automatically)
- `get(resourceId: string): Promise<ISessionData | null>` - Get session data
- `set(resourceId: string, data: ISessionData): Promise<void>` - Store session data
- `delete(resourceId: string): Promise<void>` - Delete session data
- `deleteAll(): Promise<void>` - Delete all sessions

## License

MIT
```

#### 8. Install Dependencies

```bash
cd packages/storage-mongodb
pnpm install
```

#### 9. Build

```bash
pnpm build
```

---

## Package 2: @gohighlevel/webhook-express

### Structure

```
packages/webhook-express/
├── src/
│   ├── index.ts
│   └── WebhookManager.ts
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── README.md
```

### Step-by-Step

#### 1. Create package.json

Create `packages/webhook-express/package.json`:

```json
{
  "name": "@gohighlevel/webhook-express",
  "version": "3.0.0",
  "description": "Express webhook middleware for HighLevel API SDK",
  "author": "HighLevel",
  "license": "MIT",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./package.json": "./package.json"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "clean": "rimraf dist",
    "lint": "tsc --noEmit",
    "test": "echo \"Tests coming soon\""
  },
  "dependencies": {},
  "peerDependencies": {
    "@gohighlevel/core": "workspace:*",
    "express": "^5.0.0"
  },
  "devDependencies": {
    "@gohighlevel/core": "workspace:*",
    "@types/express": "^5.0.3",
    "@types/node": "^20.0.0",
    "express": "^5.1.0",
    "rimraf": "^5.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.3.0"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "keywords": [
    "highlevel",
    "gohighlevel",
    "webhook",
    "express",
    "middleware"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/YOUR_USERNAME/ghl-api-sdk.git",
    "directory": "packages/webhook-express"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/ghl-api-sdk/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/ghl-api-sdk/tree/main/packages/webhook-express#readme"
}
```

#### 2. Create tsconfig.json

Create `packages/webhook-express/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true,
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"],
  "references": [
    {
      "path": "../core"
    }
  ]
}
```

#### 3. Create tsup.config.ts

Create `packages/webhook-express/tsup.config.ts`:

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  target: 'es2022',
  outDir: 'dist',
  external: ['@gohighlevel/core', 'express'],
});
```

#### 4. Copy Source Files

Copy from the original repo:
- `lib/webhook/webhook-manager.ts` → `packages/webhook-express/src/WebhookManager.ts`

#### 5. Update Imports

In `src/WebhookManager.ts`, update imports:

```typescript
// Change this:
import { Logger } from '../logging';
import { SessionStorage } from '../storage/session-storage';

// To this:
import { Logger, SessionStorage } from '@gohighlevel/core';
import type { Request, Response, NextFunction } from 'express';
```

#### 6. Create src/index.ts

Create `packages/webhook-express/src/index.ts`:

```typescript
// Export webhook manager
export { WebhookManager } from './WebhookManager';

// Re-export types for convenience
export type { Logger, SessionStorage } from '@gohighlevel/core';
export type { Request, Response, NextFunction } from 'express';
```

#### 7. Create README.md

Create `packages/webhook-express/README.md`:

```markdown
# @gohighlevel/webhook-express

Express middleware for handling HighLevel webhooks.

## Installation

```bash
npm install @gohighlevel/core @gohighlevel/webhook-express express
# or
pnpm add @gohighlevel/core @gohighlevel/webhook-express express
```

## Usage

```typescript
import express from 'express';
import { HighLevel } from '@gohighlevel/core';
import { WebhookManager } from '@gohighlevel/webhook-express';

const app = express();
const client = new HighLevel({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
});

const webhookManager = new WebhookManager(
  client.logger,
  client.sessionStorage,
  client.oauth
);

// Install webhook handler
app.post(
  '/webhooks/install',
  express.json(),
  webhookManager.handleInstallWebhook()
);

// Uninstall webhook handler
app.post(
  '/webhooks/uninstall',
  express.json(),
  webhookManager.handleUninstallWebhook()
);

// Generic webhook handler
app.post(
  '/webhooks',
  express.json(),
  webhookManager.verifyWebhook(),
  (req, res) => {
    console.log('Webhook received:', req.body);
    res.status(200).send('OK');
  }
);

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

## API

### `WebhookManager`

#### Constructor

```typescript
constructor(
  logger: Logger,
  sessionStorage: SessionStorage,
  oauthService: OAuthService
)
```

#### Methods

- `handleInstallWebhook(): RequestHandler` - Express middleware for install webhooks
- `handleUninstallWebhook(): RequestHandler` - Express middleware for uninstall webhooks
- `verifyWebhook(): RequestHandler` - Middleware to verify webhook signatures

## License

MIT
```

#### 8. Install Dependencies

```bash
cd packages/webhook-express
pnpm install
```

#### 9. Build

```bash
pnpm build
```

---

## Build All Packages from Root

From the root directory:

```bash
pnpm build
```

This will build all packages in dependency order using Turborepo.

## Verification Checklist

### MongoDB Storage Package
- [ ] Package builds successfully
- [ ] ESM and CJS outputs generated
- [ ] Only depends on `mongodb` (core is peer dependency)
- [ ] Imports from `@gohighlevel/core` work
- [ ] README.md created

### Express Webhook Package
- [ ] Package builds successfully
- [ ] ESM and CJS outputs generated
- [ ] Only depends on `express` (as peer dependency)
- [ ] Imports from `@gohighlevel/core` work
- [ ] README.md created

### Integration Test
- [ ] All packages build together (`pnpm build` from root)
- [ ] No circular dependencies
- [ ] TypeScript types resolve correctly

## Common Issues

### Issue 1: Cannot resolve @gohighlevel/core
**Solution**: Make sure you've built the core package first and that it's listed in peerDependencies

### Issue 2: Express types not found
**Solution**: Add `@types/express` to devDependencies

### Issue 3: MongoDB types errors
**Solution**: Update mongodb version to latest and ensure @types/node is installed

## Testing the Packages

Create a test directory at the root:

```bash
mkdir test-integration
cd test-integration
npm init -y
```

Install the packages:
```bash
pnpm add ../packages/core ../packages/storage-mongodb ../packages/webhook-express
```

Create `test.js`:
```javascript
import { HighLevel } from '@gohighlevel/core';
import { MongoDBSessionStorage } from '@gohighlevel/storage-mongodb';
import { WebhookManager } from '@gohighlevel/webhook-express';

console.log('✅ All imports successful!');
console.log('HighLevel:', typeof HighLevel);
console.log('MongoDBSessionStorage:', typeof MongoDBSessionStorage);
console.log('WebhookManager:', typeof WebhookManager);
```

Run:
```bash
node test.js
```

Should output:
```
✅ All imports successful!
HighLevel: function
MongoDBSessionStorage: function
WebhookManager: function
```

## Next Steps

Proceed to [MIGRATION_STEP_4.md](./MIGRATION_STEP_4.md) for build optimization, CI/CD setup, and publishing.

## File Checklist

### MongoDB Storage
- [ ] `packages/storage-mongodb/package.json`
- [ ] `packages/storage-mongodb/tsconfig.json`
- [ ] `packages/storage-mongodb/tsup.config.ts`
- [ ] `packages/storage-mongodb/src/index.ts`
- [ ] `packages/storage-mongodb/src/MongoDBSessionStorage.ts`
- [ ] `packages/storage-mongodb/README.md`

### Express Webhooks
- [ ] `packages/webhook-express/package.json`
- [ ] `packages/webhook-express/tsconfig.json`
- [ ] `packages/webhook-express/tsup.config.ts`
- [ ] `packages/webhook-express/src/index.ts`
- [ ] `packages/webhook-express/src/WebhookManager.ts`
- [ ] `packages/webhook-express/README.md`
