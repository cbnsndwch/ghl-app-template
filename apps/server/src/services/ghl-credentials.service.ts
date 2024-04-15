import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { pick } from 'lodash';
import { Model } from 'mongoose';

import {
    GhlCredentialsManager,
    HasId,
    IGetAccessTokenResponse,
    IGhlCredentials
} from '@cbnsndwch/ghl-app-contracts';

import { GhlCredentials, GhlCredentialsDocument } from '../entities';

import { CrudService } from './crud.service';

@Injectable()
export class GhlCredentialsService
    extends CrudService<IGhlCredentials, GhlCredentials>
    implements GhlCredentialsManager
{
    /**
     * Initializes a new instance of the `GhlCredentialsService` class.
     *
     * **NOTE**: Don't instantiate this class directly. NestJS will do that
     * for you, and take care of injecting the mongoose model instance.
     */
    constructor(
        @InjectModel(GhlCredentials.name) model: Model<GhlCredentialsDocument>
    ) {
        super(model, new Logger(GhlCredentialsService.name));
    }

    async upsertCredentials(
        credentials: IGetAccessTokenResponse
    ): Promise<IGhlCredentials> {
        const filter = pick(credentials, ['locationId', 'companyId']);
        const record = await this.findOne(filter);

        const newData: Omit<IGhlCredentials, keyof HasId> = Object.assign(
            new GhlCredentials(),
            {
                companyId: credentials.companyId,
                locationId: credentials.locationId,
                accessToken: credentials.access_token,
                refreshToken: credentials.refresh_token,
                scopes: credentials.scope ? credentials.scope.split(' ') : [],
                userType: credentials.userType,
                expiresAt: new Date(Date.now() + credentials.expires_in * 1000)
            }
        );

        if (!record) {
            return await this.create(newData);
        } else {
            return await record.set(newData).save();
        }
    }
}
