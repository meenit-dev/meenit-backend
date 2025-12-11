import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {
  AuthType,
  UserPayload,
  getJwtAdminRefreshSecret,
} from '../type/auth.type';
import { AdminService } from 'src/module/admin/service/admin.service';

@Injectable()
export class JwtAdminRefreshStrategy extends PassportStrategy(
  Strategy,
  AuthType.ADMIN_REFRESH,
) {
  constructor(private readonly adminService: AdminService) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtAdminRefreshSecret(),
    });
  }

  async validate(request: Request, payload: UserPayload) {
    await this.adminService.getAdminById(payload.id);
    return payload;
  }
}
