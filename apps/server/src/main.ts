import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

const logger = new Logger('Bootstrap');

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'verbose', 'debug']
    });

    app.setGlobalPrefix('api');

    const config = app.get(ConfigService);
    const SERVER_PORT = config.get('SERVER_PORT');

    const swaggerConfig = new DocumentBuilder()
        .setTitle('GHL App Template')
        .setDescription(
            'A demo NestJS app showcasing the new GHL Marketplace SSO feature'
        )
        .setVersion('0.1.0')
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, document);

    await app.listen(SERVER_PORT);

    logger.log(`Serving front-end on: ${await app.getUrl()}`);
    logger.log(`API is listening on: ${await app.getUrl()}/api`);
    logger.log(`Serving SwaggerUI on: ${await app.getUrl()}/swagger`);
}

bootstrap().catch(err => {
    logger.error(err);
    process.exit(1);
});
