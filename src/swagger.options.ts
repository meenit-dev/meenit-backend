import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AuthType } from './module/auth/type/auth.type';
import {
  OperationObject,
  PathItemObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { SwaggerApiTag } from '@common/type';

/**
 * 주어진 OpenAPI 문서 객체에서 특정 태그(tag)를 기준으로 API 경로(path)를 필터링합니다.
 *
 * 대상 태그가 포함된 API 경로들을 분리하여 새로운 OpenAPI 문서 객체(`targetDoc`)에 포함시키고,
 * 원래 문서 객체(`doc`)에서는 해당 경로들을 제거합니다.
 *
 * @param doc - OpenAPI 문서 객체 (원본 `paths`를 수정함)
 * @param tag - 필터링 기준이 되는 태그 문자열
 * @returns 태그가 포함된 API 경로만을 가진 새로운 OpenAPI 문서 객체
 */
function filterDocsByTag(doc: OpenAPIObject, tag: string) {
  const targetDoc = structuredClone(doc);
  targetDoc.paths = {} as Record<string, PathItemObject>;
  Object.entries(doc.paths).map(([pathKey, path]) => {
    let isFilter = false;
    for (const operation of Object.values(path)) {
      const op = operation as OperationObject;
      if (op.tags?.includes(tag)) {
        op.tags = op.tags?.filter((_tag) => tag !== _tag);
        isFilter = true;
      }
    }
    if (isFilter) {
      targetDoc.paths[pathKey] =
        targetDoc.paths[pathKey] || structuredClone(path);
      delete doc.paths[pathKey];
    }
  });
  return targetDoc;
}

function initClientApiSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('MeeNiT')
    .setDescription('MeeNiT API description')
    .addBearerAuth({ type: 'http' }, AuthType.USER)
    .addBearerAuth({ type: 'http' }, AuthType.REFRESH)
    .addApiKey(
      {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Use format: AEK {api-key}',
      },
      AuthType.API_KEY,
    )
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  filterDocsByTag(doc, SwaggerApiTag.BACK_OFFICE);

  SwaggerModule.setup('api/docs', app, doc, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}

function initBackOfficeApiSwagger(app: INestApplication) {
  const boConfig = new DocumentBuilder()
    .setTitle('BackOffice MeeNiT')
    .setDescription('BackOffice MeeNiT API description')
    .addBearerAuth({ type: 'http' }, AuthType.ADMIN)
    .addBearerAuth({ type: 'http' }, AuthType.ADMIN_REFRESH)
    .build();
  const boDoc = SwaggerModule.createDocument(app, boConfig);

  SwaggerModule.setup(
    'bo/api/docs',
    app,
    filterDocsByTag(boDoc, SwaggerApiTag.BACK_OFFICE),
    {
      swaggerOptions: {
        persistAuthorization: true,
      },
    },
  );
}

export function setSwaggerConfig(app: INestApplication) {
  initClientApiSwagger(app);
  initBackOfficeApiSwagger(app);
}
