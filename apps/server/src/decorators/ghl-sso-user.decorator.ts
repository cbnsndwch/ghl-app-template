import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { IGhlSsoSession, IUser } from '@cbnsndwch/ghl-app-contracts';

import { UserDataPipe } from '../pipes';

/**
 * A decorator that extracts the GHL SSO session information from the request.
 *
 * @returns The GHL SSO session information.
 */
export const GhlSsoSession = createParamDecorator(
    (_data: unknown, context: ExecutionContext): IGhlSsoSession => {
        const req = context.switchToHttp().getRequest();
        const session = req.user;

        return session ?? null;
    }
);

/**
 * A decorator that extracts the GHL SSO session information from the request
 * and composes it with app-specific user information fetched from your own
 * back-end.
 *
 * @param userDataPipe (Optional) A pipe that takes a GHL SSO session and merges it with
 * app-specific user information from your back-end. If not provided, the decorator
 * will just return the GHL SSO session information.
 */
export function GhlSsoUser<TUserData = IUser>(
    userDataPipe?: UserDataPipe<TUserData>
) {
    // if no user data pipe is passed in just return the GHL SSO session claims
    if (!userDataPipe) {
        return GhlSsoSession();
    }

    // otherwise compose the base decorator with the provided pipe
    return GhlSsoSession(userDataPipe);
}
