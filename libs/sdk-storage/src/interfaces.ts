/**
 * Session data interface for OAuth and authentication information
 * Used across all session storage implementations
 */
export interface ISessionData {
    access_token?: string;
    refresh_token?: string;
    token_type?: string;
    scope?: string;
    userType?: string;
    companyId?: string;
    locationId?: string;
    userId?: string;
    expires_in?: number; // Original expires_in from OAuth response (seconds)
    expire_at?: number; // Calculated expiration timestamp (milliseconds since epoch)
    [key: string]: any; // Allow additional properties
}

/**
 * Token provider interface for the core SDK
 * Minimal interface for token retrieval
 */
export interface ITokenProvider {
    /**
     * Get an access token for a company or location
     */
    getToken(type: 'company' | 'location', id: string): Promise<string | null>;

    /**
     * Store an access token for a company or location
     */
    setToken(
        type: 'company' | 'location',
        id: string,
        token: string,
        expiresAt?: Date
    ): Promise<void>;

    /**
     * Delete an access token for a company or location
     */
    deleteToken(type: 'company' | 'location', id: string): Promise<void>;
}

/**
 * Full session storage interface with CRUD operations
 * Extends ITokenProvider with complete session management
 */
export interface ISessionStorage extends ITokenProvider {
    /**
     * Initialize the storage (connect to database, etc.)
     */
    init(): Promise<void>;

    /**
     * Close/cleanup the storage
     */
    disconnect(): Promise<void>;

    /**
     * Set the client ID for the storage
     */
    setClientId(clientId: string): void;

    /**
     * Get an access token from storage (for backwards compatibility)
     */
    getAccessToken(resourceId: string): Promise<string | null>;

    /**
     * Create or update a session
     */
    setSession(resourceId: string, data: ISessionData): Promise<void>;

    /**
     * Get full session data
     */
    getSession(resourceId: string): Promise<ISessionData | null>;

    /**
     * Delete a session
     */
    deleteSession(resourceId: string): Promise<void>;

    /**
     * Check if a session exists
     */
    hasSession(resourceId: string): Promise<boolean>;
}
