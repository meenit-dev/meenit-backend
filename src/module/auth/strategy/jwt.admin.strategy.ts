import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {
  AuthType,
  UserPayload,
  getJwtAdminAccessSecret,
} from '../type/auth.type';
import { Request } from 'express';
import { AdminService } from 'src/module/admin/service/admin.service';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(
  Strategy,
  AuthType.ADMIN,
) {
  constructor(private readonly adminService: AdminService) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtAdminAccessSecret(),
    });
  }

  async validate(request: Request, payload: UserPayload) {
    try {
      await this.adminService.getAdminById(payload.id);
      return payload;
    } catch (error) {
      request.user = payload;
      throw error;
    }
  }
}
