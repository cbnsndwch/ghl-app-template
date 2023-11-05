import { Controller, Get, Headers } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CryptoJS from 'crypto-js';

@Controller()
export class SsoSessionController {
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

    @Get('api/ghl/sso/session')
    getGhlSession(@Headers('x-ghl-sso-key') encryptedSession: string): string {
        const sessionJson = CryptoJS.AES.decrypt(
            encryptedSession,
            this.GHL_SSO_KEY
        ).toString(CryptoJS.enc.Utf8);

        const session = JSON.parse(sessionJson);
        return session;
    }
}
