import { BaseSessionStorage, ISessionData } from '@cbnsndwch/ghl-sdk-storage';

/**
 * In-memory implementation of SessionStorage
 * Provides fast, non-persistent storage for sessions, tokens, and related data
 * Data is lost when the application restarts
 */
export class MemorySessionStorage extends BaseSessionStorage {
    private sessions: Map<string, ISessionData> = new Map();
    private isInitialized: boolean = false;

    /**
     * Initialize the memory storage (no-op for memory storage)
     */
    async init(): Promise<void> {
        this.isInitialized = true;
    }

    /**
     * Close the memory storage (clears all data)
     */
    async disconnect(): Promise<void> {
        this.sessions.clear();
        this.isInitialized = false;
    }

    /**
     * Store a session in memory
     * @param resourceId - Unique identifier: it can be a companyId or a locationId
     * @param sessionData - Session data to store
     */
    async setSession(
        resourceId: string,
        sessionData: ISessionData
    ): Promise<void> {
        const uniqueKey = this.generateUniqueKey(resourceId);

        // Calculate expiration if needed
        if (sessionData.expires_in && !sessionData.expire_at) {
            sessionData.expire_at = Date.now() + sessionData.expires_in * 1000;
        }

        this.sessions.set(uniqueKey, { ...sessionData });
    }

    /**
     * Retrieve a session from memory
     * @param resourceId - Unique identifier: it can be a companyId or a locationId
     * @returns Session data or null if not found
     */
    async getSession(resourceId: string): Promise<ISessionData | null> {
        const uniqueKey = this.generateUniqueKey(resourceId);
        return this.sessions.get(uniqueKey) || null;
    }

    /**
     * Delete a session from memory
     * @param resourceId - Unique identifier: it can be a companyId or a locationId
     */
    async deleteSession(resourceId: string): Promise<void> {
        const uniqueKey = this.generateUniqueKey(resourceId);
        this.sessions.delete(uniqueKey);
    }

    /**
     * Check if a session exists in memory
     * @param resourceId - Unique identifier: it can be a companyId or a locationId
     * @returns True if session exists
     */
    async hasSession(resourceId: string): Promise<boolean> {
        const uniqueKey = this.generateUniqueKey(resourceId);
        return this.sessions.has(uniqueKey);
    }

    /**
     * Check if the storage is initialized
     * @returns Initialization status
     */
    public isStorageActive(): boolean {
        return this.isInitialized;
    }

    /**
     * Get current session count
     * @returns Number of sessions stored in memory
     */
    public getSessionCount(): number {
        return this.sessions.size;
    }

    /**
     * Get all session keys (for debugging)
     * @returns Array of all session keys
     */
    public getAllSessionKeys(): string[] {
        return Array.from(this.sessions.keys());
    }

    /**
     * Clear all sessions (useful for testing)
     */
    public clearAllSessions(): void {
        this.sessions.clear();
    }
}
