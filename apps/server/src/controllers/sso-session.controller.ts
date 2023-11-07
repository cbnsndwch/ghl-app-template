import {
    Controller,
    Get,
    UnauthorizedException,
    UseGuards
} from '@nestjs/common';

import type { IGhlSsoSession, IUser } from '@cbnsndwch/ghl-app-contracts';

import { GhlSsoUser } from '../decorators';
import { GhlSsoGuard } from '../guards';

@Controller('sso')
export class SsoSessionController {
    /**
     * Returns the combined user profile data from the incoming GHL SSO session
     * and your app's back-end.
     *
     * @param user The GHL SSO session information, including app-specific user
     * information fetched from your back-end. See the `GhlSsoUser` decorator
     * implementation for more details.
     */
    @Get('ghl')
    @UseGuards(GhlSsoGuard)
    getGhlSession(@GhlSsoUser() user: IGhlSsoSession & IUser) {
        if (!user) {
            throw new UnauthorizedException(
                'No SSO session key provided, did you forget to include the `x-sso-session` header?'
            );
        }

        return user;
    }
}
