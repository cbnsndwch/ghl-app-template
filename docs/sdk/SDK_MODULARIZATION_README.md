# GHL SDK Modularization Project - README

## Overview

This folder contains documentation for migrating the monolithic GHL SDK (`libs/sdk/`) into a modular, tree-shakeable architecture.

## The Problem

The current SDK (`@cbnsndwch/ghl-api-client`) has significant architectural issues:

1. **CommonJS Lock-in**: Uses CommonJS exclusively, preventing use in modern ESM runtimes (browsers, Deno, Cloudflare Workers, etc.)
2. **Monolithic Bundle**: Forces all users to install Express, MongoDB, and other dependencies even if they only need the API client
3. **Tight Coupling**: Storage layer has hard dependencies on specific databases, making it impossible to use other storage solutions without installing unused dependencies
4. **Poor Tree-Shaking**: Cannot eliminate unused API resources from bundles

## The Solution

Break the monolithic SDK into focused, composable packages:

```text
@cbnsndwch/ghl-sdk-core          # Pure API client (800KB, axios only)
@cbnsndwch/ghl-sdk-storage       # Storage abstractions (0 deps)
@cbnsndwch/ghl-sdk-storage-memory # Memory adapter (50KB)
@cbnsndwch/ghl-sdk-storage-mongodb # MongoDB adapter (with mongodb)
@cbnsndwch/ghl-sdk-webhooks      # Webhook utilities (with adapters)
@cbnsndwch/ghl-sdk               # Meta-package (backwards compatible)
```

## Expected Benefits

- **68% smaller bundles** for API-only use cases (2.5MB → 800KB)
- **Platform-agnostic** - works in Node, Browser, Deno, Edge runtimes
- **Zero unused dependencies** - only install what you need
- **Backwards compatible** - existing code continues to work via meta-package
- **Extensible** - easy to add custom storage adapters

## Documentation

### 1. SDK_MIGRATION_PLAN.md

**Purpose**: Comprehensive architectural blueprint and migration strategy

**Use this when**: You need to understand the overall architecture, design decisions, and complete implementation details

**Contains**:
- Executive summary
- Detailed architecture diagrams
- Phase-by-phase breakdown (10 phases)
- Package specifications with complete code examples
- TypeScript interfaces and configurations
- Testing strategy
- Publishing strategy
- Timeline estimates (6-7 weeks)
- Risk mitigation strategies

**Best for**: Architects, technical leads, and developers who need the complete picture

---

### 2. SDK_IMPLEMENTATION_GUIDE.md

**Purpose**: Step-by-step implementation instructions for developers

**Use this when**: You're ready to start coding and need concrete, actionable steps

**Contains**:
- Prerequisites checklist
- Phase-by-phase implementation steps
- File-by-file instructions with exact paths
- Command sequences
- Build order dependencies
- Troubleshooting guide
- Success metrics
- Reference commands

**Best for**: Developers implementing the migration, Copilot agents executing the plan

---

### 3. SDK_QUICK_REFERENCE.md

**Purpose**: Code examples and usage patterns for all scenarios

**Use this when**: You need quick code snippets or want to see how to use the modular SDK

**Contains**:
- Package comparison table
- Installation examples for every use case
- Complete usage examples (6 scenarios)
- Before/after migration code
- Performance comparison table
- Troubleshooting Q&A
- Best practices

**Best for**: Developers learning the new API, documentation for end-users

---

## Quick Start for Copilot

To implement this migration plan, follow these steps in order:

### Step 1: Review the Plan

Read `SDK_MIGRATION_PLAN.md` to understand the architecture and approach.

### Step 2: Follow Implementation Guide

Use `SDK_IMPLEMENTATION_GUIDE.md` as your step-by-step checklist:

```bash
# Start with Phase 1: Core SDK
mkdir -p libs/sdk-core/src
# ... follow the guide
```

### Step 3: Reference Examples

Use `SDK_QUICK_REFERENCE.md` for code examples and patterns.

### Step 4: Test Each Phase

After each phase, build and test:

```bash
cd libs/sdk-core
pnpm install
pnpm build
pnpm test
```

## Package Dependency Graph

```text
sdk-core (axios)
  ↑
  ├─ sdk-webhooks (core + storage)
  ↑
sdk-storage (no deps)
  ↑
  ├─ sdk-storage-memory (storage)
  ├─ sdk-storage-mongodb (storage + mongodb)
  ↑
sdk-unified (all packages)
```

## Timeline

| Week | Tasks | Deliverables |
|------|-------|--------------|
| 1-2 | Phase 1: Core SDK | `sdk-core` package |
| 2-3 | Phase 2-3: Storage | `sdk-storage`, `sdk-storage-memory`, `sdk-storage-mongodb` |
| 3-4 | Phase 4: Webhooks | `sdk-webhooks` package |
| 4-5 | Phase 5-6: Meta + Migration | `sdk-unified`, migration guide |
| 5-6 | Phase 7: Testing | Test suites, coverage |
| 6-7 | Phase 8-10: Docs + Publish | Documentation, npm publishing |

## Success Criteria

- [ ] All 6 packages build successfully
- [ ] Zero breaking changes for meta-package users
- [ ] 68% bundle size reduction for API-only usage
- [ ] Works in Node, Browser, Deno, Edge runtimes
- [ ] 80%+ test coverage
- [ ] Complete documentation
- [ ] Published to npm

## Migration Examples

### Before (Monolithic)

```typescript
import { HighLevel, MongoDBSessionStorage } from '@cbnsndwch/ghl-api-client';

const storage = new MongoDBSessionStorage('mongodb://...', 'db');
await storage.init();

const ghl = new HighLevel({
  clientId: 'xxx',
  clientSecret: 'yyy',
  sessionStorage: storage,
});
```

### After (Modular - API Only)

```typescript
import { HighLevel } from '@cbnsndwch/ghl-sdk-core';

const ghl = new HighLevel({
  privateIntegrationToken: 'xxx',
});
```

### After (Modular - Full Stack)

```typescript
import { HighLevel } from '@cbnsndwch/ghl-sdk-core';
import { MongoDBSessionStorage } from '@cbnsndwch/ghl-sdk-storage-mongodb';

const storage = new MongoDBSessionStorage('mongodb://...', 'db');
await storage.init();
storage.setClientId('xxx');

const ghl = new HighLevel({
  clientId: 'xxx',
  clientSecret: 'yyy',
  tokenProvider: storage, // Changed from sessionStorage
});
```

## Key Changes

1. **Import paths**: `@cbnsndwch/ghl-api-client` → `@cbnsndwch/ghl-sdk-core`
2. **Config property**: `sessionStorage` → `tokenProvider`
3. **Storage setup**: Call `setClientId()` explicitly
4. **Webhooks**: Separate `WebhookManager` instantiation

## Repository Structure After Migration

```text
libs/
├── sdk-core/              # Core API client
│   ├── src/
│   │   ├── HighLevel.ts
│   │   ├── resources/     # All API resources
│   │   ├── logging/
│   │   ├── constants/
│   │   └── utils/
│   ├── package.json
│   └── tsconfig.json
│
├── sdk-storage/           # Storage interfaces
│   ├── src/
│   │   ├── interfaces.ts
│   │   └── base-storage.ts
│   └── package.json
│
├── sdk-storage-memory/    # Memory adapter
│   ├── src/
│   │   └── memory-storage.ts
│   └── package.json
│
├── sdk-storage-mongodb/   # MongoDB adapter
│   ├── src/
│   │   └── mongodb-storage.ts
│   └── package.json
│
├── sdk-webhooks/          # Webhook utilities
│   ├── src/
│   │   ├── webhook-manager.ts
│   │   ├── webhook-verifier.ts
│   │   └── adapters/
│   │       └── express.ts
│   └── package.json
│
├── sdk-unified/           # Meta-package
│   ├── src/
│   │   └── index.ts       # Re-exports all
│   └── package.json
│
└── sdk/                   # Original (deprecated)
    └── README.md          # Deprecation notice
```

## Commands

```bash
# Build all packages
pnpm build

# Build in correct order
cd libs/sdk-storage && pnpm build
cd ../sdk-core && pnpm build
cd ../sdk-storage-memory && pnpm build
cd ../sdk-storage-mongodb && pnpm build
cd ../sdk-webhooks && pnpm build
cd ../sdk-unified && pnpm build

# Test all packages
pnpm test

# Publish all packages
pnpm -r pub
```

## Deprecation Timeline

- **Month 0**: Publish v1.0 of all new packages
- **Month 3**: Mark old package as deprecated
- **Month 6**: Stop active development on old package
- **Month 12**: Archive old package completely

## Support

For questions or issues:

1. Check `SDK_QUICK_REFERENCE.md` for code examples
2. Review `SDK_IMPLEMENTATION_GUIDE.md` for troubleshooting
3. See `SDK_MIGRATION_PLAN.md` for architectural details

## Contributing

To contribute to this migration:

1. Review all three documentation files
2. Follow the implementation guide exactly
3. Write tests for each package
4. Update documentation as needed
5. Submit PR with complete phase

## License

MIT - Same as the original SDK

---

**Status**: 📝 Planning Phase

**Last Updated**: October 29, 2025

**Maintainer**: Sergio Leon (@cbnsndwch)
