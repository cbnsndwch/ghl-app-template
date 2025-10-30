# Release Process

This repository uses [Changesets](https://github.com/changesets/changesets) for version management and automated releases.

## Workflow Overview

```text
develop (development) → main (production/releases)
```

1. **Development happens on `develop`** branch
2. **Changesets track changes** as you work
3. **Version PR created automatically** on `develop`
4. **Merge to `main`** triggers the release to npm

## Day-to-Day Development

### 1. Make Your Changes

Work on your feature/fix as usual on the `develop` branch or a feature branch.

### 2. Create a Changeset

When you're ready to commit changes that should be released, create a changeset:

```bash
pnpm changeset
```

You'll be prompted to:

1. Select which packages changed (use space to select, enter to confirm)
2. Choose bump type for each package:

   - **patch**: Bug fixes, small changes (0.0.X)
   - **minor**: New features, backwards compatible (0.X.0)
   - **major**: Breaking changes (X.0.0)
3. Write a summary for the changelog

**Example changeset summary:**

```markdown
Add support for Voice AI API endpoints

This adds new methods to interact with the Voice AI API:
- `voiceAI.createAgent()` - Create a new AI agent
- `voiceAI.updateAgent()` - Update agent settings
- `voiceAI.deleteAgent()` - Remove an agent

Breaking change: The `createCall()` method now requires an `agentId` parameter.
```

### 3. Commit the Changeset

```bash
git add .changeset/
git commit -m "feat(sdk-core): add Voice AI API support"
```

The changeset file will be committed alongside your code changes.

### 4. Push to GitHub

```bash
git push origin develop
```

## Release Workflow

### Automated Process

1. **On every push to `develop`:**
   - GitHub Actions runs the "Version Packages" workflow
   - It creates/updates a PR with version bumps and changelog updates
   - PR title: "chore(release): version packages"

2. **Review the Version PR:**
   - Check the version bumps are correct
   - Review the generated CHANGELOGs
   - Ensure all changes since last release are included

3. **Merge the Version PR to `develop`:**
   - This commits the version bumps and changelog updates
   - No release happens yet (still on develop)

4. **Merge `develop` → `main`:**

   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```

   - GitHub Actions runs the "Release" workflow
   - Packages are published to npm
   - Git tags are created
   - GitHub Release is created

## Manual Release (if needed)

If you need to release manually:

```bash
# 1. Update versions and changelogs
pnpm changeset:version

# 2. Commit the changes
git add .
git commit -m "chore(release): version packages"

# 3. Publish to npm (requires NPM_TOKEN)
pnpm changeset:publish

# 4. Push commits and tags
git push --follow-tags
```

## GitHub Setup Requirements

### 1. npm Token

Create an npm access token and add it to GitHub Secrets:

1. Go to [npmjs.com](https://www.npmjs.com/) → Access Tokens
2. Create a new "Automation" token
3. In GitHub: Settings → Secrets → Actions → New repository secret
4. Name: `NPM_TOKEN`
5. Value: Your npm token

### 2. Branch Protection (Optional but Recommended)

For `main` branch:

- Require pull request reviews
- Require status checks to pass (lint, test)
- Require branches to be up to date

For `develop` branch:

- Require status checks to pass (lint, test)

## Troubleshooting

### Version PR not created

Check that:

- There are changeset files in `.changeset/` directory
- The GitHub Actions workflow has permissions to create PRs
- You're pushing to the `develop` branch

### Release not publishing

Check that:

- You merged to `main` branch
- `NPM_TOKEN` secret is configured correctly
- The packages have the correct `publishConfig` in package.json

### Need to fix something after versioning

If you need to add more changes after the version PR is created:

1. Add your changes to `develop`
2. Create a new changeset: `pnpm changeset`
3. Push to `develop`
4. The version PR will automatically update

## Checking What Will Be Released

```bash
# See what changesets exist
pnpm changeset status

# Preview version bumps (doesn't commit)
pnpm changeset version --snapshot preview
```

## Emergency Patch Release

If you need to release a critical fix quickly:

1. Create a hotfix branch from `main`
2. Make the fix
3. Create a changeset: `pnpm changeset`
4. Commit and push
5. Merge hotfix → `main`
6. Also merge hotfix → `develop` to keep branches in sync

## Version Numbering Guidelines

- **patch (0.0.X)**: Bug fixes, documentation, internal refactoring
- **minor (0.X.0)**: New features, new API methods, backwards compatible
- **major (X.0.0)**: Breaking changes, API removals, major refactors

For packages before 1.0.0:

- Still in active development
- Breaking changes can be minor bumps if needed
- Once stable, go to 1.0.0
