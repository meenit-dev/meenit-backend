import { registerDecorator, ValidationOptions } from 'class-validator';
import { CommissionOptionType } from 'src/module/commission/type/commission.type';

export function ValidateChoicesByType(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'ValidateChoicesByType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any[], args: any) {
          const obj = args.object as any;
          if (obj.type === CommissionOptionType.TEXT) return true;
          return Array.isArray(value) && value.length > 0;
        },
        defaultMessage() {
          return 'Text 타입이 아닐 때는 선택지가 최소 1개 이상이어야 합니다.';
        },
      },
    });
  };
}
