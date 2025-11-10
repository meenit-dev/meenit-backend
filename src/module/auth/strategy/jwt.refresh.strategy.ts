import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthType, UserPayload, getJwtRefreshSecret } from '../type/auth.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  AuthType.REFRESH,
) {
  constructor() {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtRefreshSecret(),
    });
  }

  async validate(request: Request, payload: UserPayload) {
    return payload;
  }
}
