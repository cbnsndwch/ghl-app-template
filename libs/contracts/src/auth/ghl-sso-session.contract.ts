import { UserRole } from './user-role.enum';
import { UserType } from './user-type.enum';

export interface IGhlSsoSessionPermissions extends Record<string, boolean> {
    workflowsEnabled: boolean;
    workflowsReadOnly: boolean;
}

/**
 * A data contract for the GHL SSO session information.
 */
export interface IGhlSsoSession {
    /**
     * The ID of the current user in the GHL main app.
     */
    userId: string;

    /**
     * The ID of the agency that the user belongs to.
     */
    companyId: string;

    /**
     * The role of the user. Supported values are:
     *
     * - `admin` - an admin user
     * - `user` - a regular user
     */
    role: UserRole;

    /**
     * The type of the user. Supported values are:
     *
     * - `agency` - an agency-level user
     * - `location` - a location-level user
     */
    type: UserType;

    /**
     * A map of permission flags for the current user.
     */
    permissions: IGhlSsoSessionPermissions;
}
