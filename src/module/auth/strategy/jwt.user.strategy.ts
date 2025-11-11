import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthType, UserPayload, getJwtAccessSecret } from '../type/auth.type';
import { AuthService } from '../service/auth.service';
import { Request } from 'express';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, AuthType.USER) {
  constructor(private readonly authService: AuthService) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtAccessSecret(),
    });
  }

  async validate(request: Request, payload: UserPayload) {
    try {
      return payload;
    } catch (error) {
      request.user = payload;
      throw error;
    }
  }
}
