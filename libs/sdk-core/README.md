# @cbnsndwch/ghl-sdk-core

Core API client for HighLevel Public APIs.

[![Sponsor cbnsndwch](https://img.shields.io/badge/Sponsor-%E2%9D%A4-red?logo=github)](https://github.com/sponsors/cbnsndwch)

## Installation

```bash
pnpm add @cbnsndwch/ghl-sdk-core
```

## Usage

### API Client Only (No Storage)

```typescript
import { HighLevel } from '@cbnsndwch/ghl-sdk-core';

const ghl = new HighLevel({
  privateIntegrationToken: 'your-token',
});

const contacts = await ghl.contacts.searchContactsAdvanced({
  locationId: 'location-id',
  // ... search params
});
```

### With Custom Token Provider

```typescript
import { HighLevel, TokenProvider } from '@cbnsndwch/ghl-sdk-core';

// Implement your own token provider
class MyTokenProvider implements TokenProvider {
  async getToken(type: 'company' | 'location', id: string): Promise<string | null> {
    // Your custom logic to retrieve tokens
    return 'token';
  }

  async setToken(type: 'company' | 'location', id: string, token: string, expiresAt?: Date): Promise<void> {
    // Your custom logic to store tokens
  }

  async deleteToken(type: 'company' | 'location', id: string): Promise<void> {
    // Your custom logic to delete tokens
  }
}

const ghl = new HighLevel({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  tokenProvider: new MyTokenProvider(),
});
```

## Features

- ✅ Zero external dependencies (except axios)
- ✅ ESM and CommonJS support
- ✅ Tree-shakeable
- ✅ Works in Node, Browser, Deno, Edge runtimes
- ✅ Full TypeScript support
- ✅ No storage dependencies - bring your own!

## API Resources

All HighLevel API resources are available:

- Associations
- Blogs
- Businesses
- Calendars
- Campaigns
- Companies
- Contacts
- Conversations
- Courses
- Custom Fields
- Custom Menus
- Email ISV
- Emails
- Forms
- Funnels
- Invoices
- Links
- Locations
- Marketplace
- Medias
- OAuth
- Objects
- Opportunities
- Payments
- Phone System
- Products
- Proposals
- SaaS API
- Snapshots
- Social Media Posting
- Store
- Surveys
- Users
- Voice AI
- Workflows

## Documentation

See the [main documentation](../../docs/sdk/SDK_MIGRATION_PLAN.md) for details.

## License

MIT
