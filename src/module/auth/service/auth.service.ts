import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/service/user.service';
import { BasicJWTResponseDto } from '../dto/auth.dto';
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
import { GetMyUserResponseDto } from 'src/module/user/dto/user.dto';
import { MailService } from 'src/module/mail/service/mail.service';
import { EmailVerificationRepository } from '../repository/email.verification.verification.repository';
import { EmailVerification } from '../entity/email.verification.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userAuthTokenRepository: UserAuthTokenRepository,
    private readonly emailVerificationRepository: EmailVerificationRepository,
    private readonly mailService: MailService,
  ) {}

  @Transactional()
  async signIn(
    ssoUserPayload: SsoUserPayload,
    singUpRequest?: {
      name: string;
      email: string;
      code: string;
    },
  ): Promise<BasicJWTResponseDto> {
    const user = await (async () => {
      const user = await this.userService.getUserByProviderAndProviderId(
        ssoUserPayload.provider,
        ssoUserPayload.id,
      );
      if (user) {
        return user;
      }
      if (singUpRequest) {
        const emailVerification = await this.validationEmailVerificationCode(
          singUpRequest.email,
          singUpRequest.code,
        );
        await this.emailVerificationRepository.save(emailVerification.use());
        return this.userService.createUser({
          email: singUpRequest.email,
          name: singUpRequest.name,
          avatar: ssoUserPayload.avatar,
          [`${ssoUserPayload.provider}Id`]: ssoUserPayload.id,
        });
      } else {
        throw new NotFoundError();
      }
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
      user: new GetMyUserResponseDto(user),
      accessToken,
      refreshToken,
    };
  }
}
