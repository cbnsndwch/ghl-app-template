import { IGetAccessTokenResponse } from './get-access-token.response';
import { IGhlCredentials } from './ghl-credentials.contract';

/**
 * A contract for an application service that stores GHL APIv2 credentials.
 * Implement this contract in your own business logic to integrate with your
 * own data store.
 */
export interface GhlCredentialsManager {
    /**
     * Persist the given credentials in the data store.
     *
     * @param credentials A credentials set received from the GHL APIv2 Access Token endpoint.
     */
    upsertCredentials(
        credentials: IGetAccessTokenResponse
    ): Promise<IGhlCredentials>;
}
