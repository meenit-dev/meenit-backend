import { applyDecorators, Type } from '@nestjs/common';
import { ApiBody, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { makeInstanceByApiProperty } from '@common/dto';
import { mergeObjects } from '@common/util';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

interface ApiMultipleBodyOption {
  model: Type<any>;
  title: string;
  overwriteValue?: Record<string, any>;
  description?: string;
  generic?: Type<any>;
}

export const ApiMultipleBody = (options: ApiMultipleBodyOption[]) => {
  const schema: SchemaObject = { oneOf: [] };
  const examples = options
    .map((response: ApiMultipleBodyOption) => {
      const DtoModel = response.model;
      schema.oneOf.push({ $ref: getSchemaPath(DtoModel) });

      const dtoData = makeInstanceByApiProperty<typeof DtoModel>(
        DtoModel,
        response.generic,
      );

      return {
        [response.title]: {
          value: response.overwriteValue
            ? mergeObjects({}, dtoData, response.overwriteValue)
            : dtoData,
          description: response.description,
        },
      };
    })
    .reduce(function (result, item) {
      Object.assign(result, item);
      return result;
    }, {});

  const extraModel = options.map((e) => {
    return e.model;
  }) as unknown as Type[];
  const extraGeneric = options
    .map((e) => {
      return e.generic;
    })
    .filter((e) => e) as unknown as Type[];

  return applyDecorators(
    ApiExtraModels(...extraModel, ...extraGeneric),
    ApiBody({
      schema,
      examples: examples,
    }),
  );
};
