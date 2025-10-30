import { LogLevelType } from './logging/index.js';

/**
 * Token provider interface for the core SDK
 * Replaces SessionStorage to decouple storage from the core API client
 */
export interface TokenProvider {
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
 * Configuration interface for HighLevel SDK
 */
export interface HighLevelConfig {
    apiVersion?: string;
    privateIntegrationToken?: string;
    agencyAccessToken?: string;
    locationAccessToken?: string;
    clientId?: string;
    clientSecret?: string;
    tokenProvider?: TokenProvider; // Replaces sessionStorage
    logLevel?: LogLevelType;
}

/**
 * Type guard to ensure valid configuration
 */
export type ValidConfig =
    | {
          privateIntegrationToken: string;
          clientId?: string;
          clientSecret?: string;
          agencyAccessToken?: string;
          locationAccessToken?: string;
          apiVersion?: string;
          tokenProvider?: TokenProvider;
          logLevel?: LogLevelType;
      }
    | {
          clientId: string;
          clientSecret: string;
          privateIntegrationToken?: undefined;
          agencyAccessToken?: string;
          locationAccessToken?: string;
          apiVersion?: string;
          tokenProvider?: TokenProvider;
          logLevel?: LogLevelType;
      };

/**
 * Interceptor interfaces
 */
export interface RequestInterceptor {
    onFulfilled?: (config: any) => any | Promise<any>;
    onRejected?: (error: any) => any;
}

export interface ResponseInterceptor {
    onFulfilled?: (response: any) => any | Promise<any>;
    onRejected?: (error: any) => any;
}
