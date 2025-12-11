import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './service/auth.service';
import { JwtUserStrategy } from './strategy/jwt.user.strategy';
import { UserModule } from '../user/user.module';
import { JwtRefreshStrategy } from './strategy/jwt.refresh.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonHttpRepository } from '@common/repository/common-http.repository';
import { UserAuthTokenRepository } from './repository/user.auth.token.repository';
import { UserAuthToken } from './entity/user.auth.token.entity';
import { AuthController } from './controller/auth.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { XStrategy } from './strategy/x.strategy';
import { MailModule } from '../mail/mail.module';
import { EmailVerificationRepository } from './repository/email.verification.verification.repository';
import { EmailVerification } from './entity/email.verification.entity';
import { SsoAccountRepository } from './repository/sso.account.repository';
import { SsoAccount } from './entity/sso.account.entity';
import { JwtOptionalUserStrategy } from './strategy/jwt.optional.user.strategy';
import { AdminModule } from '../admin/admin.module';
import { JwtAdminRefreshStrategy } from './strategy/jwt.admin.refresh.strategy';
import { JwtAdminStrategy } from './strategy/jwt.admin.strategy';
import { AdminAuthService } from './service/admin.auth.service';
import { AdminAuthController } from './controller/admin.auth.controller';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserAuthToken, EmailVerification, SsoAccount]),
    UserModule,
    AdminModule,
    MailModule,
  ],
  providers: [
    AuthService,
    AdminAuthService,
    JwtUserStrategy,
    JwtOptionalUserStrategy,
    JwtRefreshStrategy,
    JwtAdminRefreshStrategy,
    JwtAdminStrategy,
    GoogleStrategy,
    XStrategy,
    UserAuthTokenRepository,
    CommonHttpRepository,
    EmailVerificationRepository,
    SsoAccountRepository,
  ],
  exports: [AuthService],
  controllers: [AuthController, AdminAuthController],
})
export class AuthModule {}
