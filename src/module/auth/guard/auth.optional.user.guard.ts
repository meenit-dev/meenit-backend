import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthType } from '../type/auth.type';

@Injectable()
export class AuthOptionalUserGuard extends AuthGuard(AuthType.OPTIONAL_USER) {
  handleRequest(err, user, info) {
    if (err || info) {
      return null;
    }
    return user ?? null;
  }
}
