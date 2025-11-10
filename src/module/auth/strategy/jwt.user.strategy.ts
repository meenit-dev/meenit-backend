import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthType, UserPayload, getJwtAccessSecret } from '../type/auth.type';
import { AuthService } from '../service/auth.service';
import { validateOrReject } from 'class-validator';
import { GroupParamDto } from '@common/dto';
import { ForbiddenError } from '@common/error';
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
      const permissions = request['auth'].permissions as string[];
      if (permissions && permissions.length > 0) {
        await validateOrReject(new GroupParamDto(request.params.groupId));
        payload.permissions = await this.authService.checkUserPermissions(
          request.params.groupId,
          payload.userId,
          permissions,
        );
        if (
          !Object.values(payload.permissions).some(
            (hasPermission) => hasPermission,
          )
        ) {
          throw new ForbiddenError();
        }
      }
      return payload;
    } catch (error) {
      request.user = payload;
      throw error;
    }
  }
}
