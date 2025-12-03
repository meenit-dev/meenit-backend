import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthType, UserPayload, getJwtAccessSecret } from '../type/auth.type';
import { AuthService } from '../service/auth.service';
import { Request } from 'express';

const optionalBearerToken = (req: Request) => {
  const auth = req.headers.authorization;
  if (!auth) return null;
  if (!auth.startsWith('Bearer ')) return null;
  return auth.slice(7);
};

@Injectable()
export class JwtOptionalUserStrategy extends PassportStrategy(
  Strategy,
  AuthType.OPTIONAL_USER,
) {
  constructor(private readonly authService: AuthService) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromExtractors([optionalBearerToken]),
      ignoreExpiration: false,
      secretOrKey: getJwtAccessSecret(),
    });
  }

  async validate(request: Request, payload: UserPayload) {
    return payload;
  }
}
