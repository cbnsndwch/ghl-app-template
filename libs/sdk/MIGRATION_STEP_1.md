# Migration Step 1: Repository Setup

## Goal
Set up the new repository with pnpm workspaces and Turborepo for monorepo management.

## Prerequisites
- Node.js 18+ installed
- pnpm installed globally: `npm install -g pnpm`
- Git repository initialized

## Directory Structure

Create the following structure in your new repository:

```
ghl-api-sdk/                    # Root directory
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI
├── packages/
│   ├── core/                   # @gohighlevel/core
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── HighLevel.ts
│   │   │   ├── api/           # All API modules
│   │   │   │   ├── associations/
│   │   │   │   ├── blogs/
│   │   │   │   ├── businesses/
│   │   │   │   └── ... (all other API modules)
│   │   │   ├── constants/
│   │   │   ├── logging/
│   │   │   ├── storage/       # Abstract classes only
│   │   │   └── utils/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── storage-mongodb/        # @gohighlevel/storage-mongodb
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── MongoDBSessionStorage.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   └── webhook-express/        # @gohighlevel/webhook-express
│       ├── src/
│       │   ├── index.ts
│       │   └── WebhookManager.ts
│       ├── package.json
│       ├── tsconfig.json
│       └── README.md
│
├── package.json                # Workspace root
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json          # Shared TS config
├── .gitignore
├── .npmrc
├── README.md
├── LICENSE
└── CHANGELOG.md
```

## Step-by-Step Instructions

### 1. Initialize Root package.json

Create `package.json` in the root:

```json
{
  "name": "ghl-api-sdk",
  "version": "1.0.0",
  "private": true,
  "description": "Modular SDK for HighLevel Public APIs",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "clean": "turbo run clean",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "pnpm build && changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.1",
    "@types/node": "^20.0.0",
    "rimraf": "^5.0.0",
    "tsup": "^8.0.0",
    "turbo": "^2.0.0",
    "typescript": "^5.3.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

### 2. Create pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
```

### 3. Create turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

### 4. Create tsconfig.base.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": false,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true
  }
}
```

### 5. Create .npmrc

```ini
# Use pnpm for package management
auto-install-peers=true
strict-peer-dependencies=false

# Hoist packages to root node_modules when possible
shamefully-hoist=false
```

### 6. Create .gitignore

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
*.tsbuildinfo
.turbo/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Testing
coverage/
.nyc_output/

# Misc
*.tgz
.cache/
```

### 7. Install Root Dependencies

Run in the root directory:

```bash
pnpm install
```

### 8. Initialize Changesets (for versioning)

```bash
pnpm changeset init
```

This creates a `.changeset` directory for managing package versions and changelogs.

## Verification

After completing these steps, verify the setup:

```bash
# Check pnpm workspace detection
pnpm list --recursive --depth=0

# Check turbo is working
pnpm turbo --version

# Check TypeScript
pnpm tsc --version
```

You should see empty output for the first command (no packages yet) and version numbers for the others.

## Next Steps

Proceed to [MIGRATION_STEP_2.md](./MIGRATION_STEP_2.md) to create the core package.

## Common Issues

### Issue 1: pnpm not found
**Solution**: Install pnpm globally
```bash
npm install -g pnpm@latest
```

### Issue 2: Turbo not found
**Solution**: Install dependencies at root
```bash
pnpm install
```

### Issue 3: Wrong Node version
**Solution**: Use nvm or update Node.js
```bash
nvm install 18
nvm use 18
```

## File Checklist

- [ ] `package.json` (root)
- [ ] `pnpm-workspace.yaml`
- [ ] `turbo.json`
- [ ] `tsconfig.base.json`
- [ ] `.npmrc`
- [ ] `.gitignore`
- [ ] `packages/` directory created
- [ ] Dependencies installed
- [ ] Changesets initialized

## Resources

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Changesets Documentation](https://github.com/changesets/changesets)
