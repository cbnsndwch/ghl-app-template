import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { AppUserType, IGhlCredentials } from '@cbnsndwch/ghl-app-contracts';

@Schema({ collection: 'ghl_credentials' })
export class GhlCredentials implements IGhlCredentials {
    _id!: string;
    id!: string;

    @Prop({ required: true, enum: AppUserType })
    userType!: AppUserType;

    @Prop()
    companyId?: string;

    @Prop()
    companyName?: string;

    @Prop()
    locationId?: string;

    @Prop()
    locationName?: string;

    @Prop({ required: true })
    accessToken!: string;

    @Prop({ required: true })
    expiresAt!: Date;

    @Prop({ required: true })
    refreshToken!: string;

    @Prop({ required: true })
    scopes!: string[];
}

export const GhlCredentialsSchema =
    SchemaFactory.createForClass(GhlCredentials);

GhlCredentialsSchema.index(
    { companyId: 1 },
    { name: 'sidx_ghlCredentials_companyId', sparse: true }
);
GhlCredentialsSchema.index(
    { locationId: 1 },
    { name: 'sidx_ghlCredentials_locationId', sparse: true }
);
GhlCredentialsSchema.index(
    { companyId: 1, locationId: 1 },
    {
        name: 'sidx_ghlCredentials_companyId_locationId',
        sparse: true
    }
);
