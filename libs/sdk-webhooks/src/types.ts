/**
 * Webhook event types
 */
export interface WebhookInstallEvent {
    type: 'INSTALL';
    appId: string;
    versionId: string;
    installType: string;
    locationId?: string;
    companyId: string;
    userId?: string;
    companyName?: string;
    isWhitelabelCompany?: boolean;
    whitelabelDetails?: {
        logoUrl: string;
        domain: string;
    };
    planId?: string;
    trial?: object;
    timestamp: string;
    webhookId: string;
}

export interface WebhookUninstallEvent {
    type: 'UNINSTALL';
    appId: string;
    companyId: string;
    locationId?: string;
    timestamp: string;
    webhookId: string;
}

export type WebhookEvent = WebhookInstallEvent | WebhookUninstallEvent;

/**
 * Context passed to webhook handlers
 */
export interface WebhookContext {
    event: WebhookEvent;
    signature?: string;
    signatureVerified: boolean;
    skipSignatureVerification: boolean;
}

/**
 * Handler function for webhook events
 */
export type WebhookHandler = (context: WebhookContext) => Promise<void> | void;
