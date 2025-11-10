import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './service/auth.service';
import { JwtUserStrategy } from './strategy/jwt.user.strategy';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { RoleModule } from '../role/role.module';
import { GroupAuthController } from './controller/group.auth.controller';
import { JwtRefreshStrategy } from './strategy/jwt.refresh.strategy';
import { ExternalKeyModule } from '../external/key/external-key.module';
import { ApiKeyStrategy } from './strategy/api-key.strategy';
import { MailModule } from '../mail/mail.module';
import { ResetPasswordVerificationRepository } from './repository/reset.password.verification.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPasswordVerification } from './entity/reset.password.verification.entity';
import { BoAuthController } from './controller/bo.auth.controller';
import { CommonHttpRepository } from '@common/repository/common-http.repository';
import { BoAuthService } from 'src/module/auth/service/bo.auth.service';
import { AuthAdminRepository } from 'src/module/auth/repository/auth.admin.repository';
import { GroupModule } from '../group/group.module';
import { TeamModule } from '../team/team.module';
import { UserAuthTokenRepository } from './repository/user.auth.token.repository';
import { UserAuthToken } from './entity/user.auth.token.entity';
import { MetadataModule } from '../metadata/metadata.module';
import { ExternalAuthService } from './service/external.auth.service';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([ResetPasswordVerification, UserAuthToken]),
    UserModule,
    RoleModule,
    ExternalKeyModule,
    MailModule,
    GroupModule,
    TeamModule,
    MetadataModule,
  ],
  providers: [
    AuthService,
    JwtUserStrategy,
    JwtRefreshStrategy,
    ApiKeyStrategy,
    ResetPasswordVerificationRepository,
    UserAuthTokenRepository,
    CommonHttpRepository,
    AuthAdminRepository,
    BoAuthService,
    ExternalAuthService,
  ],
  controllers: [AuthController, GroupAuthController, BoAuthController],
  exports: [AuthService],
})
export class AuthModule {}
