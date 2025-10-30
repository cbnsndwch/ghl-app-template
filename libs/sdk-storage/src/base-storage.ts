import { ISessionStorage, ISessionData } from './interfaces.js';

/**
 * Abstract base class for session storage implementations
 * Provides common functionality and enforces interface
 */
export abstract class BaseSessionStorage implements ISessionStorage {
    protected clientId: string = '';

    abstract init(): Promise<void>;
    abstract disconnect(): Promise<void>;
    abstract setSession(resourceId: string, data: ISessionData): Promise<void>;
    abstract getSession(resourceId: string): Promise<ISessionData | null>;
    abstract deleteSession(resourceId: string): Promise<void>;
    abstract hasSession(resourceId: string): Promise<boolean>;

    setClientId(clientId: string): void {
        if (!clientId) {
            throw new Error('ClientId is required for session storage');
        }
        this.clientId = clientId;
    }

    protected getApplicationId(): string {
        if (!this.clientId) {
            throw new Error(
                'ClientId not set. Call setClientId() before using storage.'
            );
        }
        return this.clientId.split('-')[0];
    }

    protected generateUniqueKey(resourceId: string): string {
        const applicationId = this.getApplicationId();
        return `${applicationId}:${resourceId}`;
    }

    // ITokenProvider implementation using session methods
    async getToken(
        type: 'company' | 'location',
        id: string
    ): Promise<string | null> {
        const session = await this.getSession(id);
        return session?.access_token || null;
    }

    async setToken(
        type: 'company' | 'location',
        id: string,
        token: string,
        expiresAt?: Date
    ): Promise<void> {
        const existingSession = await this.getSession(id);

        const sessionData: ISessionData = existingSession || {};
        sessionData.access_token = token;

        if (expiresAt) {
            sessionData.expire_at = expiresAt.getTime();
        }

        await this.setSession(id, sessionData);
    }

    async deleteToken(type: 'company' | 'location', id: string): Promise<void> {
        await this.deleteSession(id);
    }

    // Backwards compatibility method
    async getAccessToken(resourceId: string): Promise<string | null> {
        const session = await this.getSession(resourceId);
        return session?.access_token || null;
    }
}
