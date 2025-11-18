import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SsoSignInQueryDto } from '../dto/auth.dto';

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  constructor() {
    super({
      accessType: 'offline',
    });
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { redirect, failedRedirect } = request.query as SsoSignInQueryDto;
    return {
      scope: ['email', 'profile'],
      state: encodeURIComponent(
        JSON.stringify({
          redirect,
          failedRedirect,
        }),
      ),
    };
  }
}
