import {
    BadRequestException,
    Controller,
    Logger,
    Get,
    Query,
    Redirect
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { GhlCredentialsService, GhlApiClient } from '../services';

@ApiTags('OAuth')
@Controller('oauth')
export class OAuthController {
    private readonly logger = new Logger(OAuthController.name);

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
    private readonly GHL_THANK_YOU_PAGE_URL: string;

    /**
     * Initializes a new instance of the `OAuthController` class.
     *
     * **NOTE**: Don't instantiate this class directly. NestJS will do that
     * for you, and take care of injecting the `ConfigService` instance.
     */
    constructor(
        private readonly credentialsService: GhlCredentialsService,
        private readonly ghlClient: GhlApiClient,
        configService: ConfigService
    ) {
        this.GHL_THANK_YOU_PAGE_URL = configService.get<string>(
            'GHL_THANK_YOU_PAGE_URL'
        )!;
    }

    /**
     * Handles the OAuth callback from GHL:
     *
     * - exchanges the OAuth code for an ceredentials set (access + refresh tokens)
     * - stores the credentials set in your app's back-end
     * - redirects the user to your app's installation thank-you page
     *
     * @param code The OAuth code from GHL
     */
    @ApiOperation({
        operationId: 'handleOauthCallback',
        summary: 'Handles the OAuth callback from GHL.',
        description: [
            `This endpoint is called by GHL after the user has authorized your app.`,
            `It exchanges the OAuth code for an ceredentials set (access + refresh tokens),`,
            `stores the credentials set in your app's back-end, and redirects the user to your`,
            `app's installation thank-you page.`
        ].join('\n'),
        externalDocs: {
            description: 'GHL APIv2 OAuth Authorization Code Flow',
            url: 'https://highlevel.stoplight.io/docs/integrations/a04191c0fabf9-authorization'
        }
    })
    @ApiQuery({
        name: 'code',
        description: 'The OAuth Authorization Code from GHL.'
    })
    @Get('callback')
    @Redirect('/', 302)
    async handleOauthCallback(
        @Query('code')
        code: string
    ) {
        if (!code) {
            const msg =
                'No OAuth Authorization Code received. Was this a valid OAuth callback?';

            this.logger.error(msg);
            throw new BadRequestException(msg);
        }

        // complete authorization code flow
        const credentials = await this.ghlClient.getAndStoreAccessToken(code);
        this.logger.log(`Received credentials ${credentials} from GHL.`);

        // redirect to your app's installation thank-you page
        return { url: this.GHL_THANK_YOU_PAGE_URL };
    }
}
