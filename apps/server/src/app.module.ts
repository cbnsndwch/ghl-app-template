import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { loadAppConfig } from './config';
import { controllers } from './controllers';
import { appConfigSchema } from './config/app-config.contract';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            load: [loadAppConfig],
            validationSchema: appConfigSchema
        }),
        ServeStaticModule.forRoot({
            rootPath: `${process.cwd()}/public`
        })
    ],
    controllers,
    providers: []
})
export class AppModule {}
