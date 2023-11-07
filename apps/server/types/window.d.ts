import type { IGhlSsoSession, IUser } from '@cbnsndwch/ghl-app-contracts';

declare global {
    interface Window {
        /**
         * The GHL SSO service.
         */
        sso: {
            getUserInfo(): Promise<IGhlSsoSession & IUser>;
        };
    }
}
