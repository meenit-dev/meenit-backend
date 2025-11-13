import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SsoSignUpQueryDto } from '../dto/auth.dto';

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  constructor() {
    super({
      accessType: 'offline',
    });
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { name, email, emailCode, redirect, failedRedirect } =
      request.query as SsoSignUpQueryDto;
    return {
      scope: ['email', 'profile'],
      state: encodeURIComponent(
        JSON.stringify({
          name,
          email,
          emailCode,
          redirect,
          failedRedirect,
        }),
      ),
    };
  }
}
