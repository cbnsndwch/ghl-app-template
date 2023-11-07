import { AppUserType } from './app-user-type.enum';

/**
 * A data contract for a GHL APIv2 credentials set.
 */
export interface IGetAccessTokenResponse {
    /**
     * Always 'Bearer' for GHL Marketplace apps.
     */
    token_type: 'Bearer';

    /**
     * The access token to use for API calls.
     */
    access_token: string;

    /**
     * The number of seconds until the access token expires, counting from the
     * time the token was issued.
     */
    expires_in: number;

    /**
     * The refresh token to use to get a new access token when the current one
     * expires.
     */
    refresh_token: string;

    /**
     * The scopes the access token grants, as a space-separated list of scope names.
     */
    scope: string;

    /**
     * The deployment mode of the app. Possible values are:
     *
     * - `Company` - An agency-level app
     * - `Location` - A location-level app
     *
     */
    userType: AppUserType;

    /**
     * The ID of the agency that installed the app or that owns the location
     * that installed the app.
     */
    companyId?: string;

    /**
     * If the app is a location-level app, the ID of the location that installed
     * the app.
     */
    locationId?: string;
}
