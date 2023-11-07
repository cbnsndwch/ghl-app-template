import { pick } from 'lodash';

import { AppConfig } from './app-config.contract';

export const loadAppConfig = () => {
    const config = pick(process.env, [
        // runtime settings
        'SERVER_PORT',
        'MONGO_URI',
        // GHL Marketplace settings
        'GHL_SSO_KEY',
        'GHL_CLIENT_ID',
        'GHL_CLIENT_SECRET',
        'GHL_API_DOMAIN'
    ]);
    return config as AppConfig;
};
