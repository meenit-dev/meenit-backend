import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export function Permissions(...permissions: string[]) {
  return function (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) {
    SetMetadata(PERMISSIONS_KEY, permissions)(target, propertyKey!, descriptor);
  };
}
