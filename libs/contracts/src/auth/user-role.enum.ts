/**
 * The roles of end-users the GHL platform supports. The combination of user
 * role and permissions (where applicable) determine what the user can do.
 */
export enum UserRole {
    /**
     * An admin user. Can access all features of accessible areas, as determined
     * by the user type:
     *
     * - Agency admins: Can access all features in agency mode and in all locations.
     * - Location admins: Can access all features in locations they're assigned to.
     */
    ADMIN = 'admin',

    /**
     * An agency or location user. Features of accessible areas are limited to
     * those tat are explicitly allowed by the user's permissions.
     */
    USER = 'user'
}
