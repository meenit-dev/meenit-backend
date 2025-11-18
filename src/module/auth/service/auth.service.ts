import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/service/user.service';
import { BasicJWTResponseDto, SsoSignUpBodyDto } from '../dto/auth.dto';
import {
  getJwtAccessExpiration,
  getJwtAccessSecret,
  getJwtRefreshExpiration,
  getJwtRefreshSecret,
  SsoUserPayload,
  UserPayload,
} from '../type/auth.type';
import { Transactional } from 'typeorm-transactional';
import { User } from 'src/module/user/entity/user.entity';
import { UserAuthTokenRepository } from '../repository/user.auth.token.repository';
import { UserAuthToken } from '../entity/user.auth.token.entity';
import { BadRequestError, NotFoundError } from '@common/error';
import { UserResponseDto } from 'src/module/user/dto/user.dto';
import { MailService } from 'src/module/mail/service/mail.service';
import { EmailVerificationRepository } from '../repository/email.verification.verification.repository';
import { EmailVerification } from '../entity/email.verification.entity';
import { SsoAccountRepository } from '../repository/sso.account.repository';
import { SsoAccount } from '../entity/sso.account.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly userAuthTokenRepository: UserAuthTokenRepository,
    private readonly emailVerificationRepository: EmailVerificationRepository,
    private readonly ssoAccountRepository: SsoAccountRepository,
  ) {}

  async testMakeToken(handle: string) {
    const user = await this.userService.getUserByHandle(handle);
    return this.makeBasicJWTResponse(user);
  }

  async signIn(ssoUserPayload: SsoUserPayload): Promise<BasicJWTResponseDto> {
    const user = await (async () => {
      const user = await this.userService.getUserByProviderAndProviderId(
        ssoUserPayload.provider,
        ssoUserPayload.id,
      );
      if (user) {
        return user;
      }
      await this.ssoAccountRepository.save(
        SsoAccount.of({
          ssoId: ssoUserPayload.id,
          avatar: ssoUserPayload.avatar,
          provider: ssoUserPayload.provider,
        }),
      );
      throw new NotFoundError();
    })();
    const userJwt = this.makeBasicJWTResponse(user, 30);
    await this.userAuthTokenRepository.save(
      UserAuthToken.of({ userId: user.id, ...userJwt }),
    );
    return userJwt;
  }

  @Transactional()
  async refresh(
    { id }: UserPayload,
    refreshToken: string,
  ): Promise<BasicJWTResponseDto> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundError();
    }
    const userAuthToken =
      await this.userAuthTokenRepository.findOneNoUsedByRefreshToken(
        refreshToken,
      );
    if (!userAuthToken) {
      throw new BadRequestError();
    }
    await this.userAuthTokenRepository.save(userAuthToken.use());
    const userJwt = this.makeBasicJWTResponse(user);

    await this.userAuthTokenRepository.save(
      UserAuthToken.of({ userId: user.id, ...userJwt }),
    );
    return userJwt;
  }

  @Transactional()
  async signUp(signUpRequest: SsoSignUpBodyDto) {
    const emailVerification = await this.validationEmailVerificationCode(
      signUpRequest.email,
      signUpRequest.code,
    );
    const ssoAccount =
      await this.ssoAccountRepository.findOneByProviderAndSsoId(
        signUpRequest.provider,
        signUpRequest.id,
      );
    if (!ssoAccount) {
      throw new BadRequestError();
    }

    await this.emailVerificationRepository.save(emailVerification.use());
    const user = await this.userService.createUser({
      email: signUpRequest.email,
      name: signUpRequest.name,
      avatar: ssoAccount.avatar,
      [`${signUpRequest.provider}Id`]: signUpRequest.id,
    });

    const userJwt = this.makeBasicJWTResponse(user, 30);
    await this.userAuthTokenRepository.save(
      UserAuthToken.of({ userId: user.id, ...userJwt }),
    );
    return userJwt;
  }

  @Transactional()
  async signOut(accessToken: string) {
    const userAuthToken =
      await this.userAuthTokenRepository.findOneByAccessToken(accessToken);
    if (userAuthToken) {
      await this.userAuthTokenRepository.softDeleteById(userAuthToken.id);
    }
  }

  async sendEmailVerificationCode(email: string) {
    await this.emailVerificationRepository.deleteNoUsedByEmail(email);
    const emailVerification = await this.emailVerificationRepository.save(
      EmailVerification.of(email),
    );
    await this.mailService.sendEmailCertificationMail(
      email,
      emailVerification.code,
      5,
    );
  }

  async validationEmailVerificationCode(email: string, code: string) {
    const emailVerification =
      await this.emailVerificationRepository.findOneNoUsedByEmailAndCode(
        email,
        code,
      );
    if (!emailVerification) {
      throw new BadRequestError();
    }
    return emailVerification;
  }

  makeBasicJWTResponse(user: User, refreshTokenExpires?: number) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: getJwtAccessSecret(),
      expiresIn: `${getJwtAccessExpiration()}s`,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: getJwtRefreshSecret(),
      expiresIn: refreshTokenExpires
        ? `${refreshTokenExpires}s`
        : `${getJwtRefreshExpiration()}s`,
    });

    return {
      user: new UserResponseDto(user),
      accessToken,
      refreshToken,
    };
  }
}
