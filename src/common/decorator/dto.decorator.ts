import { ValidateIf } from 'class-validator';

export function IsOptionalDefined() {
  return ValidateIf((_, value) => value !== undefined);
}
