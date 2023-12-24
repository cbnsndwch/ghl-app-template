import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import Joi from 'joi';

import { AppConfig, appConfigSchema, loadAppConfig } from './config';
import { controllers } from './controllers';
import { entities } from './entities';
import { services } from './services';

@Module({
    imports: [
        ConfigModule.forRoot({
            // allow the config service to be injected into other modules
            isGlobal: true,

            // load the app's configuration from the `.env` file in the root folder
            envFilePath: '.env',

            // the `loadAppConfig` function will be called to parse the environment variables
            load: [loadAppConfig],

            // validate the app's configuration against the `appConfigSchema` contract
            validationSchema: Joi.object<AppConfig>({
                ...appConfigSchema
            })
        }),
        ServeStaticModule.forRoot({
            // all files in the `public` folder will be served by the app
            rootPath: `${process.cwd()}/public`,
            // exclude API routes from the static file server
            exclude: ['/api/*', '/graphql'],
            renderPath: /\/(!:[])/
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                // load the MongoDB connection string from the app's configuration
                const uri = config.get<string>('MONGO_URI');

                // return the MongoDB connection options for Mongoose
                return { uri };
            }
        }),
        // register the app's entities with Mongoose
        MongooseModule.forFeature(entities)
    ],
    providers: [...services],
    controllers
})
export class AppModule {}
