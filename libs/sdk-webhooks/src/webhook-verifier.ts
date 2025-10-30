import * as crypto from 'crypto';

/**
 * Utility class for verifying webhook signatures
 */
export class WebhookVerifier {
    /**
     * Verify webhook signature using RSA public key
     * @param payload - The JSON stringified request body
     * @param signature - The signature from x-wh-signature header
     * @param publicKey - The RSA public key
     * @returns True if signature is valid, false otherwise
     */
    static verify(
        payload: string,
        signature: string,
        publicKey: string
    ): boolean {
        try {
            const verifier = crypto.createVerify('sha256');
            verifier.update(payload);
            verifier.end();
            return verifier.verify(publicKey, signature, 'base64');
        } catch {
            return false;
        }
    }
}
