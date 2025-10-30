/**
 * @cbnsndwch/ghl-sdk - Unified SDK Package
 *
 * Meta-package that re-exports all modular SDK packages for backwards compatibility
 * and convenience. Use this if you want everything in one package.
 *
 * For smaller bundles, import directly from specific packages:
 * - @cbnsndwch/ghl-sdk-core - API client only
 * - @cbnsndwch/ghl-sdk-storage - Storage interfaces
 * - @cbnsndwch/ghl-sdk-storage-memory - Memory storage adapter
 * - @cbnsndwch/ghl-sdk-storage-mongodb - MongoDB storage adapter
 * - @cbnsndwch/ghl-sdk-webhooks - Webhook utilities
 */

// Re-export everything from core SDK
export * from '@cbnsndwch/ghl-sdk-core';

// Re-export storage interfaces and base class
export * from '@cbnsndwch/ghl-sdk-storage';

// Re-export memory storage (most common default)
export { MemorySessionStorage } from '@cbnsndwch/ghl-sdk-storage-memory';

// Re-export webhook utilities
export * from '@cbnsndwch/ghl-sdk-webhooks';

// Default export - the main HighLevel class
export { HighLevel as default } from '@cbnsndwch/ghl-sdk-core';
