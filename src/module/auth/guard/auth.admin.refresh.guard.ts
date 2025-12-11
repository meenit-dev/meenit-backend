import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthType } from '../type/auth.type';

@Injectable()
export class AuthAdminRefreshGuard extends AuthGuard(AuthType.ADMIN_REFRESH) {}
