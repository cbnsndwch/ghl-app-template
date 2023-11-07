import Joi, { SchemaMap } from 'joi';

export interface AppConfig {
    // runtime settings
    SERVER_PORT: string;
    MONGO_URI: string;

    // GHL Marketplace settings
    GHL_SSO_KEY: string;
    GHL_CLIENT_ID: string;
    GHL_CLIENT_SECRET: string;
    GHL_API_DOMAIN: string;
}

export const appConfigSchema: SchemaMap<AppConfig> = {
    // runtime settings
    SERVER_PORT: Joi.string().default('3001'),
    MONGO_URI: Joi.string().required(),
    // GHL Marketplace settings
    GHL_SSO_KEY: Joi.string().required(),
    GHL_CLIENT_ID: Joi.string().required(),
    GHL_CLIENT_SECRET: Joi.string().required(),
    GHL_API_DOMAIN: Joi.string().default('https://services.leadconnectorhq.com')
};
