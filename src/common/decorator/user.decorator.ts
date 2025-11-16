import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';

export const ReqUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;
  return user;
});

export function IsHandle(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsHandle',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const regex = /^[A-Za-z0-9_-]{5,15}$/;
          return typeof value === 'string' && regex.test(value);
        },
        defaultMessage() {
          return '핸들은 5~15자의 영문, 숫자, _ 또는 - 만 사용할 수 있습니다.';
        },
      },
    });
  };
}
