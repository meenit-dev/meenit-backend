import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './module/database/database.module';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { I18N_LANG } from '@common/i18n';
import * as path from 'path';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from '@common/filter/exception-filter';
import { setProcessErrorHandling } from '@common/filter/util';
import { StorageModule } from './module/storage/storage.module';
import { MailModule } from './module/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: I18N_LANG.KO,
      loaderOptions: {
        path: path.join(__dirname, 'common/i18n/'),
        watch: true,
      },
      resolvers: [new HeaderResolver(['x-lang'])],
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    StorageModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_FILTER, useClass: CustomExceptionFilter }],
})
export class AppModule implements OnModuleInit {
  private logger = new Logger(AppModule.name);
  constructor() {}

  onModuleInit() {
    process.on(
      'uncaughtException',
      setProcessErrorHandling('UncaughtException', this.logger),
    );
    process.on(
      'unhandledRejection',
      setProcessErrorHandling('UnhandledRejection', this.logger),
    );
  }
}
