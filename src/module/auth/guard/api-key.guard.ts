import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthType } from '../type/auth.type';

@Injectable()
export class ApiKeyGuard extends AuthGuard(AuthType.API_KEY) {}
