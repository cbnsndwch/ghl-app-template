import { Provider } from '@nestjs/common';

import { TOKEN_GHL_CREDENTIALS_MANAGER } from '../constants';

import { GhlApiClient } from './ghl-api-client.service';
import { GhlCredentialsService } from './ghl-credentials.service';

export * from './crud.service';
export * from './ghl-api-client.service';
export * from './ghl-credentials.service';
export * from './ghl-request-options.contract';

// register application services here
export const services: Provider[] = [
    GhlApiClient,
    GhlCredentialsService,
    {
        provide: TOKEN_GHL_CREDENTIALS_MANAGER,
        useClass: GhlCredentialsService
    }
];
