import { ModelDefinition } from '@nestjs/mongoose';

import { GhlCredentials, GhlCredentialsSchema } from './ghl-credentials.entity';

export * from './ghl-credentials.entity';

export const entities: ModelDefinition[] = [
    {
        name: GhlCredentials.name,
        schema: GhlCredentialsSchema
    }
];
