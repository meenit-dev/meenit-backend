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

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserAuthToken, EmailVerification]),
    UserModule,
    MailModule,
  ],
  providers: [
    AuthService,
    JwtUserStrategy,
    JwtRefreshStrategy,
    GoogleStrategy,
    XStrategy,
    UserAuthTokenRepository,
    CommonHttpRepository,
    EmailVerificationRepository,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
