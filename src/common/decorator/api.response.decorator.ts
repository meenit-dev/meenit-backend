import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { makeInstanceByApiProperty } from '@common/dto';
import { mergeObjects } from '@common/util';

interface ApiMultipleResponseOption {
  model: Type<any>;
  title: string;
  overwriteValue?: Record<string, any>;
  description?: string;
  generic?: Type<any>;
}

export const ApiMultipleResponse = (
  StatusCode: HttpStatus,
  options: ApiMultipleResponseOption[],
) => {
  const examples = options
    .map((response: ApiMultipleResponseOption) => {
      const DtoModel = response.model;

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
  const setOfExtraModel = new Set(extraModel);
  const pathsOfDto = [...setOfExtraModel].map((e) => {
    return { $ref: getSchemaPath(e) };
  });
  const extraGeneric = options
    .map((e) => {
      return e.generic;
    })
    .filter((e) => e) as unknown as Type[];
  const pathsOfGeneric = extraGeneric.map((e) => {
    return { $ref: getSchemaPath(e) };
  });

  return applyDecorators(
    ApiExtraModels(...extraModel, ...extraGeneric),
    ApiResponse({
      status: StatusCode,
      content: {
        'application/json': {
          schema: {
            oneOf: [...pathsOfDto, ...pathsOfGeneric],
          },
          examples: examples,
        },
      },
    }),
  );
};
