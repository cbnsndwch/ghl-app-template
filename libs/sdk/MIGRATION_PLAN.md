# GHL API SDK Migration Plan

## Overview
This document outlines the migration from the monolithic SDK to a modular monorepo architecture using pnpm workspaces and Turborepo.

## Goals
1. ✅ **Universal Runtime Support**: ESM + CJS dual output for Node.js, Deno, browsers, and edge runtimes
2. ✅ **Modular Architecture**: Install only what you need
3. ✅ **Zero Forced Dependencies**: No mandatory database or framework dependencies
4. ✅ **Tree-shakeable**: Modern bundlers can eliminate unused code
5. ✅ **Developer Experience**: Better TypeScript support, smaller bundles, faster installs

## Current Problems

### Problem 1: CommonJS-Only Output
- **Impact**: Cannot use in Deno, Cloudflare Workers, Vercel Edge, or modern ESM-only environments
- **Root Cause**: `package.json` only exports CommonJS, no dual build setup
- **Solution**: Implement dual ESM/CJS builds with proper package.json exports field

### Problem 2: Monolithic Bundle
- **Impact**: All users must install Express (5.1.0) and MongoDB (6.18.0) even if unused
- **Bundle Size**: ~50MB+ node_modules for a simple API client
- **Root Cause**: All features bundled in single package with hard dependencies
- **Solution**: Split into separate packages with peer dependencies

### Problem 3: Hard Database Dependencies
- **Impact**: Users wanting Redis, Postgres, or no database still get MongoDB
- **Root Cause**: Storage implementations exported from main package
- **Solution**: Move storage adapters to separate optional packages

## Target Architecture

```
@gohighlevel/
├── core                    # Main API client (REQUIRED)
├── storage-mongodb         # MongoDB adapter (OPTIONAL)
├── storage-redis          # Redis adapter (OPTIONAL - future)
├── webhook-express        # Express middleware (OPTIONAL)
├── webhook-nextjs         # Next.js handler (OPTIONAL - future)
└── types                  # Shared TypeScript types (OPTIONAL)
```

## Package Breakdown

### Package 1: `@gohighlevel/core`
**Purpose**: Core API client with no framework dependencies

**Includes**:
- HighLevel class (main API client)
- All API modules (associations, blogs, businesses, calendars, campaigns, companies, contacts, conversations, courses, custom-fields, custom-menus, email-isv, emails, forms, funnels, invoices, links, locations, marketplace, medias, oauth, objects, opportunities, payments, phone-system, products, proposals, saas-api, snapshots, social-media-posting, store, surveys, users, voice-ai, workflows)
- Logger and logging utilities
- SessionStorage abstract class
- MemorySessionStorage (in-memory, no external deps)
- Request utilities
- Constants and enums

**Dependencies**:
```json
{
  "dependencies": {
    "axios": "^1.11.0"
  }
}
```

**Exports**: ESM + CJS dual build

---

### Package 2: `@gohighlevel/storage-mongodb`
**Purpose**: MongoDB session storage adapter

**Includes**:
- MongoDBSessionStorage implementation
- MongoDB-specific utilities

**Dependencies**:
```json
{
  "dependencies": {
    "mongodb": "^6.18.0"
  },
  "peerDependencies": {
    "@gohighlevel/core": "workspace:*"
  }
}
```

---

### Package 3: `@gohighlevel/webhook-express`
**Purpose**: Express.js webhook middleware

**Includes**:
- WebhookManager class
- Express middleware functions

**Dependencies**:
```json
{
  "dependencies": {
    "express": "^5.1.0"
  },
  "peerDependencies": {
    "@gohighlevel/core": "workspace:*"
  },
  "devDependencies": {
    "@types/express": "^5.0.3"
  }
}
```

---

### Package 4: `@gohighlevel/types` (Optional)
**Purpose**: Shared TypeScript types and interfaces

**Includes**:
- Common type definitions
- API response types
- Shared interfaces

**Dependencies**: None

---

## Migration Steps

See detailed implementation steps in:
- [`MIGRATION_STEP_1.md`](./MIGRATION_STEP_1.md) - Repository Setup
- [`MIGRATION_STEP_2.md`](./MIGRATION_STEP_2.md) - Core Package Migration
- [`MIGRATION_STEP_3.md`](./MIGRATION_STEP_3.md) - Adapter Packages
- [`MIGRATION_STEP_4.md`](./MIGRATION_STEP_4.md) - Build & Publishing

## Breaking Changes

### For Existing Users

#### Before (Monolithic):
```typescript
import { 
  HighLevel, 
  MongoDBSessionStorage, 
  WebhookManager 
} from '@gohighlevel/api-client';

const storage = new MongoDBSessionStorage(url, db);
const client = new HighLevel({ 
  clientId, 
  clientSecret, 
  sessionStorage: storage 
});
```

#### After (Modular):
```typescript
// Core API client
import { HighLevel, MemorySessionStorage } from '@gohighlevel/core';

// Optional: MongoDB adapter (only if needed)
import { MongoDBSessionStorage } from '@gohighlevel/storage-mongodb';

// Optional: Express webhooks (only if needed)
import { WebhookManager } from '@gohighlevel/webhook-express';

const storage = new MongoDBSessionStorage(url, db);
const client = new HighLevel({ 
  clientId, 
  clientSecret, 
  sessionStorage: storage 
});
```

### Migration Guide for Users

1. **API Client Only** (most users):
   ```bash
   npm uninstall @gohighlevel/api-client
   npm install @gohighlevel/core
   ```
   No code changes needed if not using MongoDB or webhooks!

2. **With MongoDB Storage**:
   ```bash
   npm install @gohighlevel/core @gohighlevel/storage-mongodb
   ```
   Update imports:
   ```diff
   - import { HighLevel, MongoDBSessionStorage } from '@gohighlevel/api-client';
   + import { HighLevel } from '@gohighlevel/core';
   + import { MongoDBSessionStorage } from '@gohighlevel/storage-mongodb';
   ```

3. **With Express Webhooks**:
   ```bash
   npm install @gohighlevel/core @gohighlevel/webhook-express
   ```
   Update imports:
   ```diff
   - import { HighLevel, WebhookManager } from '@gohighlevel/api-client';
   + import { HighLevel } from '@gohighlevel/core';
   + import { WebhookManager } from '@gohighlevel/webhook-express';
   ```

## Benefits After Migration

### Bundle Size Comparison

| Use Case | Before | After | Savings |
|----------|--------|-------|---------|
| API Client Only | ~52 MB | ~8 MB | **85% smaller** |
| API + MongoDB | ~52 MB | ~28 MB | **46% smaller** |
| API + Express | ~52 MB | ~18 MB | **65% smaller** |

### Runtime Compatibility

| Runtime | Before | After |
|---------|--------|-------|
| Node.js (CJS) | ✅ | ✅ |
| Node.js (ESM) | ❌ | ✅ |
| Deno | ❌ | ✅ |
| Cloudflare Workers | ❌ | ✅ |
| Vercel Edge | ❌ | ✅ |
| Browser (bundled) | ⚠️ | ✅ |
| Bun | ⚠️ | ✅ |

### Developer Experience

- ✅ Faster `npm install` (fewer dependencies)
- ✅ Smaller `node_modules`
- ✅ Better tree-shaking support
- ✅ Choose your own database/framework
- ✅ No unused code in production bundles
- ✅ Works in all modern JavaScript runtimes

## Timeline

1. **Phase 1**: Repository setup (pnpm + Turborepo) - 1 day
2. **Phase 2**: Core package migration - 2-3 days
3. **Phase 3**: Adapter packages - 2 days
4. **Phase 4**: Build system & CI/CD - 1-2 days
5. **Phase 5**: Testing & documentation - 2-3 days
6. **Phase 6**: Publishing & migration guide - 1 day

**Total**: ~2 weeks for full migration

## Success Metrics

- [ ] All packages build successfully (ESM + CJS)
- [ ] Core package has zero framework dependencies
- [ ] Bundle size reduced by >80% for API-only use case
- [ ] All existing tests pass
- [ ] Works in Node.js, Deno, and edge runtimes
- [ ] TypeScript types work correctly
- [ ] Published to npm registry
- [ ] Migration guide complete

## References

- Original repo: https://github.com/GoHighLevel/highlevel-api-sdk
- Current package: `@gohighlevel/api-client@2.2.1`
- Target packages: `@gohighlevel/core@3.0.0` and adapters
