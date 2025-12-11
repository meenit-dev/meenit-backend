import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthType } from '../type/auth.type';

@Injectable()
export class AuthAdminGuard extends AuthGuard(AuthType.ADMIN) {}
