import { ISessionStorage } from '@cbnsndwch/ghl-sdk-storage';

import { WebhookEvent, WebhookContext, WebhookHandler } from './types.js';
import { WebhookVerifier } from './webhook-verifier.js';

/**
 * Configuration for WebhookManager
 */
export interface WebhookManagerConfig {
    clientId: string;
    clientSecret: string;
    publicKey?: string;
    storage: ISessionStorage;
}

/**
 * WebhookManager handles incoming webhooks from GoHighLevel
 * Decoupled from Express - framework adapters handle HTTP specifics
 */
export class WebhookManager {
    private config: WebhookManagerConfig;
    private handlers: Map<string, WebhookHandler[]> = new Map();

    constructor(config: WebhookManagerConfig) {
        this.config = config;

        // Register default handlers
        this.on('INSTALL', this.handleInstall.bind(this));
        this.on('UNINSTALL', this.handleUninstall.bind(this));
    }

    /**
     * Register a webhook event handler
     * @param eventType - The event type (INSTALL, UNINSTALL, etc.)
     * @param handler - The handler function
     */
    on(eventType: string, handler: WebhookHandler): void {
        const handlers = this.handlers.get(eventType) || [];
        handlers.push(handler);
        this.handlers.set(eventType, handlers);
    }

    /**
     * Process a webhook event
     * @param event - The webhook event
     * @param signature - Optional signature for verification
     * @returns The webhook context
     */
    async process(
        event: WebhookEvent,
        signature?: string
    ): Promise<WebhookContext> {
        const appId = this.config.clientId.split('-')[0];

        // Validate app ID
        if (appId !== event.appId) {
            throw new Error(
                `App ID mismatch: expected ${appId}, got ${event.appId}`
            );
        }

        // Verify signature if provided
        let signatureVerified = false;
        let skipSignatureVerification = false;

        if (signature && this.config.publicKey) {
            const payload = JSON.stringify(event);
            signatureVerified = WebhookVerifier.verify(
                payload,
                signature,
                this.config.publicKey
            );

            if (!signatureVerified) {
                throw new Error('Invalid webhook signature');
            }
        } else {
            skipSignatureVerification = true;
        }

        const context: WebhookContext = {
            event,
            signature,
            signatureVerified,
            skipSignatureVerification
        };

        // Execute handlers
        const handlers = this.handlers.get(event.type) || [];
        for (const handler of handlers) {
            await handler(context);
        }

        return context;
    }

    /**
     * Default INSTALL handler - stores the company/location session
     * Note: This is a placeholder - actual token generation would require OAuth flow
     */
    private async handleInstall(context: WebhookContext): Promise<void> {
        const event = context.event as any; // WebhookInstallEvent

        // In a real implementation, you would:
        // 1. Use the OAuth flow to generate access tokens
        // 2. Store the tokens in session storage

        // Placeholder - actual implementation would call OAuth endpoint
        // and store resulting tokens
        // TODO: Implement OAuth flow for INSTALL events
        const resourceId = event.locationId || event.companyId;
        void resourceId; // Suppress unused variable warning
    }

    /**
     * Default UNINSTALL handler - removes tokens from storage
     */
    private async handleUninstall(context: WebhookContext): Promise<void> {
        const event = context.event as any; // WebhookUninstallEvent

        const resourceId = event.locationId || event.companyId;
        if (resourceId) {
            await this.config.storage.deleteSession(resourceId);
        }
    }
}
