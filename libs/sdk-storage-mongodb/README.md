# @cbnsndwch/ghl-sdk-storage-mongodb

MongoDB storage adapter for GHL SDK.

[![Sponsor cbnsndwch](https://img.shields.io/badge/Sponsor-%E2%9D%A4-red?logo=github)](https://github.com/sponsors/cbnsndwch)

## Installation

```bash
pnpm add @cbnsndwch/ghl-sdk-storage-mongodb mongodb
```

## Usage

```typescript
import { HighLevel } from '@cbnsndwch/ghl-sdk-core';
import { MongoDBSessionStorage } from '@cbnsndwch/ghl-sdk-storage-mongodb';

// Create MongoDB storage
const storage = new MongoDBSessionStorage(
  'mongodb://localhost:27017',
  'mydb',
  'ghl_sessions' // optional, defaults to 'ghl_sessions'
);

await storage.init();
storage.setClientId(process.env.GHL_CLIENT_ID);

// Use with HighLevel SDK
const ghl = new HighLevel({
  clientId: process.env.GHL_CLIENT_ID,
  clientSecret: process.env.GHL_CLIENT_SECRET,
  tokenProvider: storage,
});

// Make API calls - tokens will be stored in MongoDB
const contacts = await ghl.contacts.searchContactsAdvanced({
  locationId: 'location-id',
  // ... search params
});

// Cleanup when done
await storage.disconnect();
```

## Features

- ✅ Persistent storage in MongoDB
- ✅ Automatic indexes for performance
- ✅ ESM-only
- ✅ Full TypeScript support
- ✅ Production-ready

## API

### MongoDBSessionStorage

Extends `BaseSessionStorage` from `@cbnsndwch/ghl-sdk-storage`.

#### Constructor

```typescript
new MongoDBSessionStorage(
  dbUrl: string,
  dbName: string,
  collectionName?: string // defaults to 'ghl_sessions'
)
```

#### Methods

- `init()` - Connect to MongoDB and create indexes
- `disconnect()` - Close MongoDB connection
- `setClientId(clientId)` - Set the client ID
- `setSession(resourceId, data)` - Store a session
- `getSession(resourceId)` - Retrieve a session
- `deleteSession(resourceId)` - Delete a session
- `hasSession(resourceId)` - Check if session exists
- `getToken(type, id)` - Get access token (implements ITokenProvider)
- `setToken(type, id, token, expiresAt)` - Store access token
- `deleteToken(type, id)` - Delete access token
- `isStorageActive()` - Check if connected to MongoDB

## MongoDB Schema

The adapter creates a collection with the following indexes:

```javascript
{
  resourceId: 1 // unique index
},
{
  expire_at: 1 // for TTL and expiration queries
}
```

## License

MIT
