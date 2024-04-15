/**
 * The types of end-users the GHL platform supports.
 */
export enum UserType {
    /**
     * An agency-level user. Can access all locations as well as the agency area.
     */
    AGENCY = 'agency',

    /**
     * A location-level user. Can only access the locations they are assigned to.
     */
    LOCATION = 'location'
}
