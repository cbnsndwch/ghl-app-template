/**
 * The authorization levels and deployment modes supported for GHL Marketplace apps.
 */
export enum AppUserType {
    /**
     * An agency-level app. Can call agency-level API endpoints and generate
     * location-level access tokens.
     */
    COMPANY = 'Company',

    /**
     * A location-level app. Can call location-level API endpoints only.
     */
    LOCATION = 'Location'
}
