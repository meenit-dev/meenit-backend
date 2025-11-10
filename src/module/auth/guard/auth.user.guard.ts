import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthType } from '../type/auth.type';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '@common/decorator';

@Injectable()
export class AuthUserGuard extends AuthGuard(AuthType.USER) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const permissions =
      this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler()) ||
      this.reflector.get<string[]>(PERMISSIONS_KEY, context.getClass());
    const request = context.switchToHttp().getRequest<Request>();

    request['auth'] = {
      permissions,
    };

    return super.canActivate(context);
  }
}
