# @cbnsndwch/ghl-sdk-storage-memory

In-memory storage adapter for GHL SDK.

[![Sponsor cbnsndwch](https://img.shields.io/badge/Sponsor-%E2%9D%A4-red?logo=github)](https://github.com/sponsors/cbnsndwch)

## Installation

```bash
pnpm add @cbnsndwch/ghl-sdk-storage-memory
```

## Usage

```typescript
import { HighLevel } from '@cbnsndwch/ghl-sdk-core';
import { MemorySessionStorage } from '@cbnsndwch/ghl-sdk-storage-memory';

// Create memory storage
const storage = new MemorySessionStorage();
await storage.init();
storage.setClientId(process.env.GHL_CLIENT_ID);

// Use with HighLevel SDK
const ghl = new HighLevel({
  clientId: process.env.GHL_CLIENT_ID,
  clientSecret: process.env.GHL_CLIENT_SECRET,
  tokenProvider: storage,
});

// Make API calls - tokens will be stored in memory
const contacts = await ghl.contacts.searchContactsAdvanced({
  locationId: 'location-id',
  // ... search params
});
```

## Features

- ✅ Fast in-memory storage
- ✅ Zero external dependencies (only `@cbnsndwch/ghl-sdk-storage`)
- ✅ Perfect for development and testing
- ✅ ESM-only
- ✅ Full TypeScript support

## API

### MemorySessionStorage

Extends `BaseSessionStorage` from `@cbnsndwch/ghl-sdk-storage`.

#### Methods

- `init()` - Initialize the storage (no-op for memory)
- `disconnect()` - Clear all sessions
- `setClientId(clientId)` - Set the client ID
- `setSession(resourceId, data)` - Store a session
- `getSession(resourceId)` - Retrieve a session
- `deleteSession(resourceId)` - Delete a session
- `hasSession(resourceId)` - Check if session exists
- `getToken(type, id)` - Get access token (implements ITokenProvider)
- `setToken(type, id, token, expiresAt)` - Store access token
- `deleteToken(type, id)` - Delete access token

#### Utility Methods

- `isStorageActive()` - Check if storage is initialized
- `getSessionCount()` - Get number of stored sessions
- `getAllSessionKeys()` - Get all session keys (debugging)
- `clearAllSessions()` - Clear all sessions

## Notes

⚠️ **Important**: Data is stored in memory and will be lost when the application restarts. For production use, consider using `@cbnsndwch/ghl-sdk-storage-mongodb` or implementing a custom persistent storage adapter.

## License

MIT
