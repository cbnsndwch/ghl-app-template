import { HasId } from '../common';

import { AppUserType } from './app-user-type.enum';

/**
 * A data contract for a GHL APIv2 credentials set.
 */
export interface IGhlCredentials extends HasId {
    /**
     * The access token to use for API calls.
     */
    accessToken: string;

    /**
     * The date and time the access token will expire.
     */
    expiresAt: Date;

    /**
     * The refresh token to use to get a new access token when the current one
     * expires.
     */
    refreshToken: string;

    /**
     * The scopes the access token grants.
     */
    scopes: string[];

    /**
     * The deployment mode of the app. Possible values are:
     *
     * - `Company` - An agency-level app
     * - `Location` - A location-level app
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
