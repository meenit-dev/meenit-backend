import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BasicJWTResponseDto } from '../dto/auth.dto';
import {
  getJwtAdminAccessExpiration,
  getJwtAdminAccessSecret,
  getJwtAdminRefreshExpiration,
  getJwtAdminRefreshSecret,
} from '../type/auth.type';
import { Transactional } from 'typeorm-transactional';
import { AdminService } from 'src/module/admin/service/admin.service';
import { AdminSignInBodyDto } from '../dto/admin.auth.dto';
import { Admin } from 'src/module/admin/entity/admin.entity';
import { UUID } from '@common/type';
import { encryptSha512 } from '@common/util';
import { BadRequestError } from '@common/error';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    signInRequest: AdminSignInBodyDto,
  ): Promise<BasicJWTResponseDto> {
    const admin = await this.adminService.getAdminByEmail(signInRequest.email);
    if (admin.password !== encryptSha512(signInRequest.password, admin.salt)) {
      throw new BadRequestError();
    }
    return this.makeBasicJWTResponse(admin);
  }

  @Transactional()
  async refresh(id: UUID): Promise<BasicJWTResponseDto> {
    const admin = await this.adminService.getAdminById(id);
    return this.makeBasicJWTResponse(admin);
  }

  makeBasicJWTResponse(admin: Admin, refreshTokenExpires?: number) {
    const payload = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: getJwtAdminAccessSecret(),
      expiresIn: `${getJwtAdminAccessExpiration()}s`,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: getJwtAdminRefreshSecret(),
      expiresIn: refreshTokenExpires
        ? `${refreshTokenExpires}s`
        : `${getJwtAdminRefreshExpiration()}s`,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
