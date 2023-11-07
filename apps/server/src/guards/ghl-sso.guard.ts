import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CryptoJS from 'crypto-js';

/**
 * A guard that decrypts a GHL SSO session key and sets the session information
 * as the `user` field on the request.
 */
@Injectable()
export class GhlSsoGuard implements CanActivate {
    private readonly logger = new Logger(GhlSsoGuard.name);

    /**
     * Your app's SSO Key from the GHL Marketplace.
     *
     * You can find your GHL SSO key under Settings in your Marketplace App's
     * details page. It should look like this:
     * xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
     *
     * NOTE: It's a best practice to load secrets from environment variables
     * instead of hardcoding them in your code.
     */
    private readonly GHL_SSO_KEY: string;

    /**
     * Initializes a new instance of the `SsoSessionController` class.
     *
     * **NOTE**: Don't instantiate this class directly. NestJS will do that
     * for you, and take care of injecting the `ConfigService` instance.
     */
    constructor(configService: ConfigService) {
        this.GHL_SSO_KEY = configService.get<string>('GHL_SSO_KEY')!;
    }

    /**
     * Validates a GHL SSO session key and sets the session information as the
     * `user` field on the request.
     *
     * @param context The request execution context.
     * @returns `true` if the request includes a valid GHL SSO Session key, `false` otherwise.
     */
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const encryptedSession = request.headers['x-sso-session'] as string;

        if (!encryptedSession) {
            this.logger.error(
                'No GHL SSO session key provided, did you forget to include the `x-sso-session` header?'
            );
            return false;
        }

        try {
            const sessionJson = CryptoJS.AES.decrypt(
                encryptedSession,
                this.GHL_SSO_KEY
            ).toString(CryptoJS.enc.Utf8);

            const session = JSON.parse(sessionJson);
            request.user = session;

            return true;
        } catch (err) {
            this.logger.warn(
                `Invalid GHL SSO session key provided, please try again: ${
                    err.message || err
                }`
            );
            this.logger.error(err);
        }

        return false;
    }
}
