import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { winstonLogger } from '@common/logger/winston-logger';
import { expressMiddleware } from 'cls-rtracer';
import { json, urlencoded } from 'express';
import { LoggingInterceptor } from '@common/interceptor/logging.interceptor';
import { setSwaggerConfig } from './swagger.options';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { I18nMiddleware } from 'nestjs-i18n';
import { AuthOptionalUserGuard } from './module/auth/guard/auth.optional.user.guard';

const { PORT } = process.env;

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule, { logger: winstonLogger });

  app
    .enableVersioning({
      type: VersioningType.URI,
      prefix: 'api/v',
    })
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    )
    .use(I18nMiddleware)
    .use(expressMiddleware())
    .use(json({ limit: '50mb' }))
    .use(urlencoded({ extended: true, limit: '50mb' }))
    .useGlobalInterceptors(new LoggingInterceptor())
    .enableCors();

  app.useGlobalGuards(new AuthOptionalUserGuard());

  setSwaggerConfig(app);

  await app.startAllMicroservices();

  await app.listen(PORT || 4000);
}
bootstrap();
