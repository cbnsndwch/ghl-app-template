import {
    Controller,
    Get,
    Logger,
    UnauthorizedException,
    UseGuards
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { IGhlSsoSession, IUser } from '@cbnsndwch/ghl-app-contracts';

import { GhlSsoUser } from '../decorators';
import { GhlSsoGuard } from '../guards';

@ApiTags('SSO')
@Controller('sso')
export class SsoSessionController {
    private readonly logger = new Logger(SsoSessionController.name);

    /**
     * Returns the combined user profile data from the incoming GHL SSO session
     * and your app's back-end.
     *
     * @param user The GHL SSO session information, including app-specific user
     * information fetched from your back-end. See the `GhlSsoUser` decorator
     * implementation for more details.
     */
    @ApiOperation({
        operationId: 'getUserInfo',
        summary: 'Retrieve user info from the GHL SSO session.',
        description: [
            `Returns the combined user profile data from the incoming GHL SSO session`,
            `and your app's back-end.`
        ].join('\n'),
        externalDocs: {
            description: 'GHL SSO integration for Marketplace apps',
            url: 'https://ideas.gohighlevel.com/changelog/sso-in-our-developer-app-marketplace'
        }
    })
    @ApiHeader({
        name: 'x-sso-session',
        description:
            'The SSO session key for you app, as returned by the GHL main app.'
    })
    @Get('ghl')
    @UseGuards(GhlSsoGuard)
    getUserInfo(@GhlSsoUser() user: IGhlSsoSession & IUser) {
        this.logger.debug('getUserInfo', user);

        if (!user) {
            throw new UnauthorizedException(
                'No SSO session key provided, did you forget to include the `x-sso-session` header?'
            );
        }

        return user;
    }
}
