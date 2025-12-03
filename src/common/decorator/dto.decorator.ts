import { Transform } from 'class-transformer';
import { ValidateIf } from 'class-validator';

export function IsOptionalDefined() {
  return ValidateIf((_, value) => value !== undefined);
}

export function TransArrayQuery() {
  return Transform(({ value }) =>
    Array.isArray(value) ? value : value?.split(',') || [],
  );
}

export function ToBoolean() {
  return Transform((value) => {
    return value.value == 'true' ? true : false;
  });
}
