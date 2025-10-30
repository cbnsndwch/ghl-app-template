# @cbnsndwch/ghl-sdk-storage

Storage abstractions for GHL SDK.

[![Sponsor cbnsndwch](https://img.shields.io/badge/Sponsor-%E2%9D%A4-red?logo=github)](https://github.com/sponsors/cbnsndwch)

## Installation

```bash
pnpm add @cbnsndwch/ghl-sdk-storage
```

## Usage

This package provides interfaces and base classes for implementing custom storage adapters for the GHL SDK.

### Interfaces

#### ITokenProvider

Minimal interface for token retrieval:

```typescript
import { ITokenProvider } from '@cbnsndwch/ghl-sdk-storage';

class MyTokenProvider implements ITokenProvider {
  async getToken(type: 'company' | 'location', id: string): Promise<string | null> {
    // Your implementation
  }

  async setToken(type: 'company' | 'location', id: string, token: string, expiresAt?: Date): Promise<void> {
    // Your implementation
  }

  async deleteToken(type: 'company' | 'location', id: string): Promise<void> {
    // Your implementation
  }
}
```

#### ISessionStorage

Full session storage interface:

```typescript
import { ISessionStorage, ISessionData } from '@cbnsndwch/ghl-sdk-storage';

class MySessionStorage implements ISessionStorage {
  async init(): Promise<void> { /* ... */ }
  async disconnect(): Promise<void> { /* ... */ }
  setClientId(clientId: string): void { /* ... */ }
  async getAccessToken(resourceId: string): Promise<string | null> { /* ... */ }
  async setSession(resourceId: string, data: ISessionData): Promise<void> { /* ... */ }
  async getSession(resourceId: string): Promise<ISessionData | null> { /* ... */ }
  async deleteSession(resourceId: string): Promise<void> { /* ... */ }
  async hasSession(resourceId: string): Promise<boolean> { /* ... */ }
  async getToken(type: 'company' | 'location', id: string): Promise<string | null> { /* ... */ }
  async setToken(type: 'company' | 'location', id: string, token: string, expiresAt?: Date): Promise<void> { /* ... */ }
  async deleteToken(type: 'company' | 'location', id: string): Promise<void> { /* ... */ }
}
```

### Base Class

Extend `BaseSessionStorage` to get common functionality:

```typescript
import { BaseSessionStorage, ISessionData } from '@cbnsndwch/ghl-sdk-storage';

class MyCustomStorage extends BaseSessionStorage {
  async init(): Promise<void> {
    // Initialize your storage
  }

  async disconnect(): Promise<void> {
    // Cleanup
  }

  async setSession(resourceId: string, data: ISessionData): Promise<void> {
    const key = this.generateUniqueKey(resourceId);
    // Store session data
  }

  async getSession(resourceId: string): Promise<ISessionData | null> {
    const key = this.generateUniqueKey(resourceId);
    // Retrieve session data
    return null;
  }

  async deleteSession(resourceId: string): Promise<void> {
    const key = this.generateUniqueKey(resourceId);
    // Delete session data
  }

  async hasSession(resourceId: string): Promise<boolean> {
    const key = this.generateUniqueKey(resourceId);
    // Check if session exists
    return false;
  }
}
```

## Features

- ✅ Zero dependencies
- ✅ ESM-only
- ✅ Full TypeScript support
- ✅ Base class with common functionality
- ✅ Flexible interfaces for custom implementations

## Related Packages

- [@cbnsndwch/ghl-sdk-core](../sdk-core) - Core API client
- [@cbnsndwch/ghl-sdk-storage-memory](../sdk-storage-memory) - Memory storage adapter
- [@cbnsndwch/ghl-sdk-storage-mongodb](../sdk-storage-mongodb) - MongoDB storage adapter

## License

MIT
