import type { Request, Response } from 'express';

import { WebhookManager } from '../webhook-manager.js';

/**
 * Create Express middleware for webhook processing
 * @param manager - The WebhookManager instance
 * @returns Express middleware function
 */
export function createExpressMiddleware(manager: WebhookManager) {
    return async (req: Request, res: Response) => {
        try {
            const signature = req.headers['x-wh-signature'] as
                | string
                | undefined;
            const event = req.body;

            const context = await manager.process(event, signature);

            // Attach context to request for downstream middleware
            (req as any).webhookContext = context;

            // Send success response
            res.status(200).json({ success: true });
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';

            // Send error response
            res.status(400).json({
                success: false,
                error: errorMessage
            });
        }
    };
}
