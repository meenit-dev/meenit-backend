import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ExternalKeyPayload } from 'src/module/auth/type/auth.type';

export const ReqAEK = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const externalKeyPayload = req.user as ExternalKeyPayload;
  return externalKeyPayload;
});
