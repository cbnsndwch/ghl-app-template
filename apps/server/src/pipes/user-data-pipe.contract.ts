import { PipeTransform } from '@nestjs/common';

import type { IGhlSsoSession, IUser } from '@cbnsndwch/ghl-app-contracts';

export type UserDataPipe<TUserData = IUser> = PipeTransform<
    IGhlSsoSession,
    Promise<IGhlSsoSession & TUserData>
>;
