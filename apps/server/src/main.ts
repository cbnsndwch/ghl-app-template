import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

const logger = new Logger('Bootstrap');

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const SERVER_PORT = app.get(ConfigService).get('SERVER_PORT');

    await app.listen(SERVER_PORT);

    logger.log(`API is listening on: ${await app.getUrl()}`);
}

bootstrap().catch(err => {
    logger.error(err);
    process.exit(1);
});
