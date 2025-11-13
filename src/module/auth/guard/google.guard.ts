import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  constructor() {
    super({
      accessType: 'offline',
    });
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { name, redirect, failedRedirect } = request.query;
    return {
      scope: ['email', 'profile'],
      state: encodeURIComponent(
        JSON.stringify({ name, redirect, failedRedirect }),
      ),
    };
  }
}
