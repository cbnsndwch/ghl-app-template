import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

const logger = new Logger('Bootstrap');

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');

    const config = app.get(ConfigService);
    const SERVER_PORT = config.get('SERVER_PORT');

    await app.listen(SERVER_PORT);

    logger.log(`API is listening on: ${await app.getUrl()}`);
}

bootstrap().catch(err => {
    logger.error(err);
    process.exit(1);
});
