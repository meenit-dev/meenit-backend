/* eslint-disable @typescript-eslint/ban-types */
import { ApiPropertyOptions } from '@nestjs/swagger';

const DECORATORS_PREFIX = 'swagger';
const API_MODEL_PROPERTIES = `${DECORATORS_PREFIX}/apiModelProperties`;
const API_MODEL_PROPERTIES_ARRAY = `${DECORATORS_PREFIX}/apiModelPropertiesArray`;

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

function isObject(value) {
  const type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

function isFunction(value): value is Function {
  if (!isObject(value)) {
    return false;
  }
  return true;
}

function isLazyTypeFunc(
  type: Function | Type<unknown>,
): type is { type: Function } & Function {
  return isFunction(type) && type.name == 'type';
}

function isPrimitiveType(
  type:
    | string
    | Function
    | Type<unknown>
    | [Function]
    | Record<string, any>
    | undefined,
): boolean {
  return (
    typeof type === 'function' &&
    [String, Boolean, Number].some((item) => item === type)
  );
}

function checkType(object: any): object is Type {
  return object;
}

type ApiPropertyOptionsWithFieldName = ApiPropertyOptions & {
  fieldName: string;
};

export function makeInstanceByApiProperty<T>(
  dtoClass: Type,
  generic?: Type,
): T {
  const mappingDto = {};

  const propertiesArray: string[] =
    Reflect.getMetadata(API_MODEL_PROPERTIES_ARRAY, dtoClass.prototype) || [];

  const properties: ApiPropertyOptionsWithFieldName[] = propertiesArray.map(
    (field) => {
      const fieldName = field.substring(1);
      const obj = Reflect.getMetadata(
        API_MODEL_PROPERTIES,
        dtoClass.prototype,
        fieldName,
      );
      obj.fieldName = fieldName;
      return obj;
    },
  );

  for (const property of properties) {
    const propertyType = property.type;
    if (propertyType) {
      if (propertyType === 'generic') {
        if (generic) {
          if (property.isArray) {
            mappingDto[property.fieldName] = [
              makeInstanceByApiProperty(generic),
            ];
          } else {
            mappingDto[property.fieldName] = makeInstanceByApiProperty(generic);
          }
        }
      } else if (
        propertyType === 'string' ||
        propertyType === 'number' ||
        isPrimitiveType(propertyType)
      ) {
        if (typeof property.example !== 'undefined') {
          mappingDto[property.fieldName] = property.example;
        } else {
          mappingDto[property.fieldName] = property.description;
        }
      } else if (isLazyTypeFunc(propertyType as Function | Type<unknown>)) {
        const constructorType = (propertyType as Function)();

        if (Array.isArray(constructorType)) {
          mappingDto[property.fieldName] = [
            makeInstanceByApiProperty(constructorType[0]),
          ];
        } else if (property.isArray) {
          mappingDto[property.fieldName] = [
            makeInstanceByApiProperty(constructorType),
          ];
        } else {
          mappingDto[property.fieldName] =
            makeInstanceByApiProperty(constructorType);
        }
      } else if (checkType(propertyType)) {
        if (['string', 'number', 'boolean'].includes(typeof property.example)) {
          mappingDto[property.fieldName] = property.example;
        } else if (property.isArray) {
          mappingDto[property.fieldName] = [
            makeInstanceByApiProperty(propertyType),
          ];
        } else {
          mappingDto[property.fieldName] =
            makeInstanceByApiProperty(propertyType);
        }
      }
    }
  }
  return mappingDto as T;
}
