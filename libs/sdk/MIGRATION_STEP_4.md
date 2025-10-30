# Migration Step 4: Build System, CI/CD & Publishing

## Goal
Set up automated builds, testing, and publishing workflows for the monorepo.

## Part 1: Build System Optimization

### Update turbo.json for Build Caching

Update `turbo.json` in the root:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "*.tsbuildinfo"],
      "env": ["NODE_ENV"]
    },
    "lint": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build", "build"],
      "outputs": ["coverage/**"],
      "env": ["NODE_ENV"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

### Add Lint and Typecheck Scripts

Update root `package.json` scripts:

```json
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "clean": "turbo run clean",
    "format": "prettier --write \"packages/**/*.{ts,tsx,md,json}\"",
    "format:check": "prettier --check \"packages/**/*.{ts,tsx,md,json}\"",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "pnpm build && changeset publish"
  }
}
```

### Add Prettier

Install Prettier:
```bash
pnpm add -D -w prettier
```

Create `.prettierrc.json`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

Create `.prettierignore`:
```
node_modules
dist
build
coverage
.turbo
*.log
pnpm-lock.yaml
```

### Add ESLint (Optional)

Install ESLint:
```bash
pnpm add -D -w eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Create `.eslintrc.json`:
```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "env": {
    "node": true,
    "es2022": true
  },
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  },
  "ignorePatterns": ["dist", "node_modules", "*.cjs", "*.mjs"]
}
```

Add lint script to each package's `package.json`:
```json
{
  "scripts": {
    "lint": "eslint src --ext .ts"
  }
}
```

---

## Part 2: GitHub Actions CI/CD

### Create .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint-and-typecheck:
    name: Lint & Typecheck
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 8

      - name: Get pnpm store directory
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - name: Setup pnpm cache
        uses: actions/cache@v4
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Typecheck
        run: pnpm typecheck

      - name: Format check
        run: pnpm format:check

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck]
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 8

      - name: Get pnpm store directory
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - name: Setup pnpm cache
        uses: actions/cache@v4
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-artifacts
          path: |
            packages/*/dist
          retention-days: 7

  test:
    name: Test
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run tests
        run: pnpm test
```

### Create .github/workflows/release.yml

```yaml
name: Release

on:
  push:
    branches:
      - main

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      id-token: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: pnpm release
          version: pnpm version-packages
          commit: 'chore: version packages'
          title: 'chore: version packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Setup NPM Publishing

1. **Get NPM Token**:
   - Go to https://www.npmjs.com/
   - Login and go to Access Tokens
   - Generate a new "Automation" token
   - Copy the token

2. **Add GitHub Secret**:
   - Go to your GitHub repo → Settings → Secrets → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your NPM token

3. **Configure NPM Scope** (if using @gohighlevel scope):
   - Create `.npmrc` in root:
   ```ini
   @gohighlevel:registry=https://registry.npmjs.org/
   //registry.npmjs.org/:_authToken=${NPM_TOKEN}
   ```

---

## Part 3: Versioning with Changesets

### Initialize Changesets

Already done in Step 1, but configure it:

Edit `.changeset/config.json`:
```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": [],
  "___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH": {
    "onlyUpdatePeerDependentsWhenOutOfRange": true
  }
}
```

### Creating a Changeset

When you make changes that should be released:

```bash
pnpm changeset
```

Follow the prompts:
1. Select which packages changed
2. Choose version bump type (major/minor/patch)
3. Write a summary of changes

This creates a file in `.changeset/` directory.

### Example Workflow

```bash
# Make changes to core package
# Add a changeset
pnpm changeset

# Select: @gohighlevel/core
# Type: minor (for new features)
# Summary: "Add new API endpoint for workflows"

# Commit the changeset
git add .changeset
git commit -m "feat: add workflows API endpoint"
git push
```

When merged to main, GitHub Actions will:
1. Create a "Version Packages" PR with updated versions
2. When that PR is merged, automatically publish to NPM

---

## Part 4: Package Publishing Preparation

### Update Package Scopes

If publishing under your own scope, update all `package.json` files:

```json
{
  "name": "@yourscope/core",
  // or use a different name entirely
  "name": "ghl-api-core"
}
```

### Pre-publish Checklist

Before first publish, ensure:

1. **Package names are unique** on npm:
   ```bash
   npm search @yourscope/core
   ```

2. **All packages have**:
   - Correct `repository` URLs
   - `LICENSE` file
   - `README.md`
   - Proper `keywords`
   - `homepage` and `bugs` URLs

3. **Build outputs are correct**:
   ```bash
   pnpm build
   # Check each package's dist folder
   ls -la packages/core/dist
   ls -la packages/storage-mongodb/dist
   ls -la packages/webhook-express/dist
   ```

4. **Test local install**:
   ```bash
   cd /tmp
   mkdir test-install
   cd test-install
   npm init -y
   npm install /path/to/your/repo/packages/core
   ```

### Publish Manually (First Time)

For the first release, you may want to publish manually:

```bash
# Build everything
pnpm build

# Publish core first
cd packages/core
npm publish --access public

# Then adapters
cd ../storage-mongodb
npm publish --access public

cd ../webhook-express
npm publish --access public
```

Or use changeset:
```bash
# Create changesets for initial release
pnpm changeset

# Version all packages to 3.0.0
pnpm version-packages

# Publish
pnpm release
```

---

## Part 5: Documentation

### Create Root README.md

Update the root `README.md`:

```markdown
# HighLevel API SDK (Modular)

Modern, modular TypeScript/JavaScript SDK for HighLevel Public APIs.

## 📦 Packages

| Package | Version | Description |
|---------|---------|-------------|
| [@gohighlevel/core](./packages/core) | [![npm](https://img.shields.io/npm/v/@gohighlevel/core)](https://www.npmjs.com/package/@gohighlevel/core) | Core API client |
| [@gohighlevel/storage-mongodb](./packages/storage-mongodb) | [![npm](https://img.shields.io/npm/v/@gohighlevel/storage-mongodb)](https://www.npmjs.com/package/@gohighlevel/storage-mongodb) | MongoDB storage adapter |
| [@gohighlevel/webhook-express](./packages/webhook-express) | [![npm](https://img.shields.io/npm/v/@gohighlevel/webhook-express)](https://www.npmjs.com/package/@gohighlevel/webhook-express) | Express webhook middleware |

## ✨ Features

- 🌍 **Universal**: Works in Node.js, Deno, browsers, Cloudflare Workers, Vercel Edge
- 📦 **Modular**: Install only what you need
- 🎯 **Type-safe**: Full TypeScript support
- 🚀 **Modern**: ESM + CJS dual builds
- 🪶 **Lightweight**: No unnecessary dependencies
- 🌲 **Tree-shakeable**: Optimized for modern bundlers

## 🚀 Quick Start

### API Client Only

```bash
npm install @gohighlevel/core
```

```typescript
import { HighLevel } from '@gohighlevel/core';

const client = new HighLevel({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
});

const contacts = await client.contacts.search('locationId', {
  query: 'john@example.com'
});
```

### With MongoDB Storage

```bash
npm install @gohighlevel/core @gohighlevel/storage-mongodb
```

```typescript
import { HighLevel } from '@gohighlevel/core';
import { MongoDBSessionStorage } from '@gohighlevel/storage-mongodb';

const storage = new MongoDBSessionStorage(
  'mongodb://localhost:27017',
  'ghl-sessions'
);
await storage.init();

const client = new HighLevel({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  sessionStorage: storage
});
```

### With Express Webhooks

```bash
npm install @gohighlevel/core @gohighlevel/webhook-express express
```

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

app.post('/webhooks', express.json(), webhookManager.verifyWebhook(), (req, res) => {
  console.log('Webhook:', req.body);
  res.send('OK');
});
```

## 📖 Documentation

- [Core Package Documentation](./packages/core/README.md)
- [MongoDB Storage Documentation](./packages/storage-mongodb/README.md)
- [Express Webhooks Documentation](./packages/webhook-express/README.md)
- [API Reference](https://highlevel.stoplight.io/)

## 🏗️ Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Watch mode
pnpm dev

# Lint
pnpm lint

# Format
pnpm format
```

### Adding a Changeset

```bash
pnpm changeset
```

## 📝 License

MIT © HighLevel

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📊 Bundle Size Comparison

| Use Case | Old SDK | New SDK | Savings |
|----------|---------|---------|---------|
| API Client Only | ~52 MB | ~8 MB | **85%** |
| API + MongoDB | ~52 MB | ~28 MB | **46%** |
| API + Express | ~52 MB | ~18 MB | **65%** |

## 🎯 Migration from v2.x

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed migration instructions.
```

### Create MIGRATION_GUIDE.md

Create a user-facing migration guide in the root:

```markdown
# Migration Guide: v2.x → v3.x

## Overview

Version 3.0 introduces a modular architecture. The main changes:

1. **Package split**: Core API client is now separate from adapters
2. **ESM + CJS**: Dual builds for universal compatibility
3. **Optional dependencies**: Only install what you need

## Breaking Changes

### Package Names

| v2.x | v3.x |
|------|------|
| `@gohighlevel/api-client` | `@gohighlevel/core` |
| N/A | `@gohighlevel/storage-mongodb` |
| N/A | `@gohighlevel/webhook-express` |

### Installation

**Before (v2.x)**:
```bash
npm install @gohighlevel/api-client
```

**After (v3.x)**:
```bash
# Core only
npm install @gohighlevel/core

# With MongoDB
npm install @gohighlevel/core @gohighlevel/storage-mongodb

# With Express webhooks
npm install @gohighlevel/core @gohighlevel/webhook-express
```

### Imports

**Before (v2.x)**:
```typescript
import { 
  HighLevel,
  MongoDBSessionStorage,
  WebhookManager
} from '@gohighlevel/api-client';
```

**After (v3.x)**:
```typescript
import { HighLevel } from '@gohighlevel/core';
import { MongoDBSessionStorage } from '@gohighlevel/storage-mongodb';
import { WebhookManager } from '@gohighlevel/webhook-express';
```

## Migration Steps

### Step 1: Update Dependencies

```bash
npm uninstall @gohighlevel/api-client
npm install @gohighlevel/core

# If using MongoDB
npm install @gohighlevel/storage-mongodb

# If using Express webhooks
npm install @gohighlevel/webhook-express
```

### Step 2: Update Imports

Find and replace in your codebase:

```typescript
// Find:
import { ... } from '@gohighlevel/api-client';

// Replace with appropriate imports:
import { HighLevel } from '@gohighlevel/core';
// Add others as needed
```

### Step 3: Test

Run your tests to ensure everything works correctly.

## Use Case Examples

### 1. API Client Only (No Storage)

**Before**:
```typescript
import { HighLevel } from '@gohighlevel/api-client';

const client = new HighLevel({
  privateIntegrationToken: 'token'
});
```

**After**:
```typescript
import { HighLevel } from '@gohighlevel/core';

const client = new HighLevel({
  privateIntegrationToken: 'token'
});
```

✅ **No code changes needed!** Just update the import.

### 2. With MongoDB Storage

**Before**:
```typescript
import { HighLevel, MongoDBSessionStorage } from '@gohighlevel/api-client';

const storage = new MongoDBSessionStorage(url, db);
const client = new HighLevel({ sessionStorage: storage });
```

**After**:
```typescript
import { HighLevel } from '@gohighlevel/core';
import { MongoDBSessionStorage } from '@gohighlevel/storage-mongodb';

const storage = new MongoDBSessionStorage(url, db);
const client = new HighLevel({ sessionStorage: storage });
```

✅ **Code logic unchanged**, just split imports.

### 3. With Express Webhooks

**Before**:
```typescript
import { HighLevel, WebhookManager } from '@gohighlevel/api-client';

const client = new HighLevel({ ... });
const webhookManager = new WebhookManager(...);
```

**After**:
```typescript
import { HighLevel } from '@gohighlevel/core';
import { WebhookManager } from '@gohighlevel/webhook-express';

const client = new HighLevel({ ... });
const webhookManager = new WebhookManager(...);
```

✅ **Code logic unchanged**, just split imports.

## Benefits of v3.x

- ✅ **Smaller bundles**: 85% size reduction for API-only use cases
- ✅ **Faster installs**: Fewer dependencies to download
- ✅ **Universal compatibility**: Works in Deno, browsers, edge runtimes
- ✅ **Better tree-shaking**: Modern bundlers can optimize better
- ✅ **Flexible**: Choose your own database/framework

## Support

If you encounter issues during migration:

1. Check this guide
2. Review package READMEs
3. Open an issue on GitHub

## Rollback

If needed, you can rollback to v2.x:

```bash
npm install @gohighlevel/api-client@2.2.1
```
```

---

## Verification Checklist

- [ ] Turbo build caching configured
- [ ] Prettier configured
- [ ] ESLint configured (optional)
- [ ] GitHub Actions CI workflow created
- [ ] GitHub Actions release workflow created
- [ ] NPM token added to GitHub secrets
- [ ] Changesets configured
- [ ] Root README updated
- [ ] MIGRATION_GUIDE created
- [ ] All package READMEs complete
- [ ] LICENSE files in all packages

## Publishing Checklist

- [ ] All builds pass locally
- [ ] All tests pass
- [ ] Package names are unique on npm
- [ ] Repository URLs are correct
- [ ] Keywords added to all packages
- [ ] Changesets created for initial release
- [ ] Version bumped to 3.0.0
- [ ] Published to npm (or ready for automation)

## Next Steps

Your monorepo is now ready! 

1. **Push to GitHub**: Git push your changes
2. **Test CI**: GitHub Actions will run automatically
3. **Create Release**: Merge a changeset PR to trigger release
4. **Monitor**: Check npm for published packages

## Resources

- [Turborepo Handbook](https://turbo.build/repo/docs/handbook)
- [Changesets Documentation](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
