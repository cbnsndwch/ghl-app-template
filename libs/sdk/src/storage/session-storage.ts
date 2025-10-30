import { Logger } from '../logging';
import { ISessionData } from './interfaces';

/**
 * Abstract base class for session storage implementations
 * Provides interface for storing and retrieving user sessions, tokens, and related data
 */
export abstract class SessionStorage {
  protected logger: Logger;

  constructor(logger?: Logger) {
    this.logger = logger || new Logger('warn', 'GHL SDK Storage');
  }
  /**
   * Set the client ID (called automatically by HighLevel class)
   * @param clientId - The client ID from HighLevel configuration
   */
  abstract setClientId(clientId: string): void;

  /**
   * Initialize the storage connection
   * This method is called automatically when the storage is initialized in HighLevel constructor
   */
  abstract init(): Promise<void>;

  /**
   * Close the connection to the storage
   */
  abstract disconnect(): Promise<void>;

  /**
   * Create a collection/table if it doesn't exist
   * @param collectionName - Name of the collection to create
   */
  abstract createCollection(collectionName: string): Promise<void>;

  /**
   * Get a reference to a collection/table
   * @param collectionName - Name of the collection to get
   */
  abstract getCollection(collectionName: string): Promise<any>;

  /**
   * Store a session in the storage
   * @param resourceId - Unique identifier for the resource (companyId or locationId)
   * @param sessionData - Session data to store
   */
  abstract setSession(resourceId: string, sessionData: ISessionData): Promise<void>;

  /**
   * Retrieve a session from the storage
   * @param resourceId - Unique identifier for the resource (companyId or locationId)
   * @returns Session data or null if not found
   */
  abstract getSession(resourceId: string): Promise<ISessionData | null>;

  /**
   * Delete a session from the storage
   * @param resourceId - Unique identifier for the resource (companyId or locationId)
   */
  abstract deleteSession(resourceId: string): Promise<void>;

  /**
   * Get only the access token for a resource
   * @param resourceId - Unique identifier for the resource (companyId or locationId)
   * @returns Access token or null if not found
   */
  abstract getAccessToken(resourceId: string): Promise<string | null>;

  /**
   * Get only the refresh token for a resource
   * @param resourceId - Unique identifier for the resource (companyId or locationId)
   * @returns Refresh token or null if not found
   */
  abstract getRefreshToken(resourceId: string): Promise<string | null>;

  /**
   * Get all sessions for the current application (optional method)
   * This method is optional and can be overridden by implementations that support it
   * @returns Array of session data for the current application
   * @throws Error if not implemented by the storage implementation
   */
  async getSessionsByApplication(): Promise<ISessionData[]> {
    throw new Error('getSessionsByApplication is not implemented by this storage provider');
  }

  /**
   * Calculate the expiration timestamp in milliseconds
   * @param expiresIn - The number of seconds until expiration (optional)
   * @returns The timestamp in milliseconds
   */
  protected readonly calculateExpireAt = (expiresIn?: number): number => {
    if (expiresIn === undefined || expiresIn === null) {
      // Default to 24 hours if no expires_in provided
      return Date.now() + (24 * 60 * 60 * 1000);
    }
    return Date.now() + (expiresIn * 1000);
  };
} 