# Migration Step 2: Core Package Migration

## Goal
Create the `@gohighlevel/core` package with dual ESM/CJS output and zero framework dependencies.

## Overview

The core package includes:
- HighLevel API client (main class)
- All API modules (associations, blogs, businesses, etc.)
- Logging utilities
- Storage abstractions (interfaces only)
- MemorySessionStorage (no external deps)
- Request utilities
- Constants and types

**Critical**: This package must have ONLY `axios` as a dependency.

## Package Structure

```
packages/core/
├── src/
│   ├── index.ts                    # Main exports
│   ├── HighLevel.ts               # Main API client class
│   │
│   ├── api/                       # All API modules
│   │   ├── associations/
│   │   │   ├── associations.ts
│   │   │   └── models/
│   │   │       └── associations.ts
│   │   ├── blogs/
│   │   │   ├── blogs.ts
│   │   │   └── models/
│   │   │       └── blogs.ts
│   │   ├── businesses/
│   │   ├── calendars/
│   │   ├── campaigns/
│   │   ├── companies/
│   │   ├── contacts/
│   │   ├── conversations/
│   │   ├── courses/
│   │   ├── custom-fields/
│   │   ├── custom-menus/
│   │   ├── email-isv/
│   │   ├── emails/
│   │   ├── forms/
│   │   ├── funnels/
│   │   ├── invoices/
│   │   ├── links/
│   │   ├── locations/
│   │   ├── marketplace/
│   │   ├── medias/
│   │   ├── oauth/
│   │   ├── objects/
│   │   ├── opportunities/
│   │   ├── payments/
│   │   ├── phone-system/
│   │   ├── products/
│   │   ├── proposals/
│   │   ├── saas-api/
│   │   ├── snapshots/
│   │   ├── social-media-posting/
│   │   ├── store/
│   │   ├── surveys/
│   │   ├── users/
│   │   ├── voice-ai/
│   │   └── workflows/
│   │
│   ├── constants/
│   │   ├── index.ts
│   │   └── user-types.ts
│   │
│   ├── logging/
│   │   ├── index.ts
│   │   ├── log-level.ts
│   │   └── logger.ts
│   │
│   ├── storage/
│   │   ├── index.ts
│   │   ├── interfaces.ts
│   │   ├── session-storage.ts      # Abstract class
│   │   └── memory-session-storage.ts  # In-memory implementation
│   │
│   └── utils/
│       └── request-utils.ts
│
├── package.json
├── tsconfig.json
├── tsup.config.ts                  # Build configuration
└── README.md
```

## Step-by-Step Instructions

### 1. Create package.json

Create `packages/core/package.json`:

```json
{
  "name": "@gohighlevel/core",
  "version": "3.0.0",
  "description": "Core API client for HighLevel Public APIs",
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
    "axios": "^1.11.0"
  },
  "devDependencies": {
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
    "api",
    "sdk",
    "ghl",
    "typescript",
    "javascript",
    "esm",
    "cjs"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/YOUR_USERNAME/ghl-api-sdk.git",
    "directory": "packages/core"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/ghl-api-sdk/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/ghl-api-sdk/tree/main/packages/core#readme"
}
```

### 2. Create tsconfig.json

Create `packages/core/tsconfig.json`:

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
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

### 3. Create tsup.config.ts

Create `packages/core/tsup.config.ts` for dual ESM/CJS builds:

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
  external: ['axios'],
});
```

### 4. Copy Source Files from Original Repo

Copy these directories from the original repo to `packages/core/src/`:

#### From `lib/` to `src/`:
- `HighLevel.ts` → `src/HighLevel.ts`
- `constants/` → `src/constants/`
- `logging/` → `src/logging/`
- `utils/` → `src/utils/`

#### From `lib/code/` to `src/api/`:
Copy ALL API module directories:
- `lib/code/associations/` → `src/api/associations/`
- `lib/code/blogs/` → `src/api/blogs/`
- `lib/code/businesses/` → `src/api/businesses/`
- ... (all 36 API modules)

#### From `lib/storage/` to `src/storage/`:
Copy ONLY these files (exclude MongoDB):
- `interfaces.ts` → `src/storage/interfaces.ts`
- `session-storage.ts` → `src/storage/session-storage.ts`
- `memory-session-storage.ts` → `src/storage/memory-session-storage.ts`

**DO NOT COPY**:
- `mongodb-session-storage.ts` (goes to separate package)
- `lib/webhook/` (goes to separate package)

### 5. Modify HighLevel.ts

In `src/HighLevel.ts`, remove references to MongoDB and webhooks:

#### Remove these imports:
```typescript
// DELETE THESE LINES
import { WebhookManager } from './webhook';
```

#### Update the class:
Remove the `webhooks` property and its initialization. The WebhookManager will be handled in the separate package.

### 6. Create src/index.ts

Create `packages/core/src/index.ts`:

```typescript
// Main API client
export { 
  HighLevel, 
  type HighLevelConfig, 
  type ValidConfig, 
  GHLError, 
  type RequestInterceptor, 
  type ResponseInterceptor 
} from './HighLevel';

// Storage abstractions
export { 
  SessionStorage, 
  MemorySessionStorage, 
  type ISessionData 
} from './storage';

// Logging
export { 
  Logger, 
  LogLevel, 
  type LogLevelType, 
  type LogLevelString 
} from './logging';

// Constants
export { 
  UserType, 
  type UserTypeValue 
} from './constants';

// Default export
export { HighLevel as default } from './HighLevel';
```

### 7. Update storage/index.ts

Create `packages/core/src/storage/index.ts`:

```typescript
// Export the base SessionStorage abstract class
export { SessionStorage } from './session-storage';

// Export the Memory implementation (no external deps)
export { MemorySessionStorage } from './memory-session-storage';

// Export interfaces
export { type ISessionData } from './interfaces';
```

**Note**: MongoDB storage is NOT exported from core!

### 8. Install Dependencies

```bash
cd packages/core
pnpm install
```

### 9. Build the Package

```bash
pnpm build
```

Verify the output:
```bash
ls -la dist/
```

You should see:
- `index.js` (ESM)
- `index.cjs` (CommonJS)
- `index.d.ts` (TypeScript types for ESM)
- `index.d.cts` (TypeScript types for CJS)
- `*.map` files (source maps)

### 10. Test the Build

Create a test file `packages/core/test-import.mjs`:

```javascript
import { HighLevel } from './dist/index.js';

console.log('ESM import successful:', typeof HighLevel);
```

And `packages/core/test-require.cjs`:

```javascript
const { HighLevel } = require('./dist/index.cjs');

console.log('CJS require successful:', typeof HighLevel);
```

Run tests:
```bash
node test-import.mjs
node test-require.cjs
```

Both should print "function".

### 11. Create README.md

Create `packages/core/README.md`:

```markdown
# @gohighlevel/core

Core API client for HighLevel Public APIs. Works in Node.js, Deno, browsers, and edge runtimes.

## Installation

```bash
npm install @gohighlevel/core
# or
pnpm add @gohighlevel/core
# or
yarn add @gohighlevel/core
```

## Features

- ✅ **Universal**: Works in Node.js, Deno, browsers, Cloudflare Workers, Vercel Edge
- ✅ **Modern**: ESM + CJS dual builds
- ✅ **Lightweight**: Only depends on axios (~300KB)
- ✅ **Type-safe**: Full TypeScript support
- ✅ **Tree-shakeable**: Import only what you need

## Usage

### Basic Example

```typescript
import { HighLevel } from '@gohighlevel/core';

const client = new HighLevel({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
});

// Use the API
const contacts = await client.contacts.search('locationId', {
  query: 'john@example.com'
});
```

### With In-Memory Session Storage

```typescript
import { HighLevel, MemorySessionStorage } from '@gohighlevel/core';

const storage = new MemorySessionStorage();
const client = new HighLevel({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  sessionStorage: storage
});
```

### With Custom Storage Adapter

See [@gohighlevel/storage-mongodb](../storage-mongodb) for MongoDB adapter.

## API Documentation

Full API documentation available at: https://highlevel.stoplight.io/

## License

MIT
```

## Verification Checklist

- [ ] Package builds successfully (`pnpm build`)
- [ ] ESM output exists (`dist/index.js`)
- [ ] CJS output exists (`dist/index.cjs`)
- [ ] Type definitions exist (`dist/index.d.ts` and `dist/index.d.cts`)
- [ ] Only `axios` in dependencies (no Express, no MongoDB)
- [ ] ESM import works (`node test-import.mjs`)
- [ ] CJS require works (`node test-require.cjs`)
- [ ] All API modules copied correctly
- [ ] Storage abstractions exported (SessionStorage, MemorySessionStorage)
- [ ] MongoDB storage NOT included in this package

## Common Issues

### Issue 1: "Cannot find module" errors
**Solution**: Check that all imports use relative paths without `.ts` extension
```typescript
// ✅ Good
import { Logger } from './logging';
// ❌ Bad
import { Logger } from './logging.ts';
```

### Issue 2: Circular dependencies
**Solution**: Refactor imports to break cycles, or use type-only imports:
```typescript
import type { SomeType } from './module';
```

### Issue 3: Build fails with axios error
**Solution**: Make sure axios is listed in package.json dependencies AND in tsup.config.ts external array

## Next Steps

Proceed to [MIGRATION_STEP_3.md](./MIGRATION_STEP_3.md) to create the adapter packages.

## File Checklist

- [ ] `packages/core/package.json`
- [ ] `packages/core/tsconfig.json`
- [ ] `packages/core/tsup.config.ts`
- [ ] `packages/core/src/index.ts`
- [ ] `packages/core/src/HighLevel.ts` (modified)
- [ ] `packages/core/src/api/` (all 36 modules copied)
- [ ] `packages/core/src/constants/`
- [ ] `packages/core/src/logging/`
- [ ] `packages/core/src/storage/` (no MongoDB)
- [ ] `packages/core/src/utils/`
- [ ] `packages/core/README.md`
- [ ] Build artifacts in `dist/`
