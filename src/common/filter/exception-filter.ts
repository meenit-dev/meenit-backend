import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserPayload } from 'src/module/auth/type/auth.type';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ValidationError } from 'class-validator';
import { isAxiosError } from 'axios';
import { I18N_LANG } from '@common/i18n';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  #logger = new Logger(CustomExceptionFilter.name);
  private readonly teamsUrl = process.env.TEAMS_WEBHOOK_URL;

  constructor(private readonly i18n: I18nService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const i18nLang = this.getI18NLang(host);
    if (Array.isArray(exception)) {
      exception = exception[0];
      if (exception instanceof ValidationError) {
        exception['name'] = 'ValidationError';
        exception['statusCode'] = 400;
      }
    } else if (isAxiosError(exception)) {
      const exceptionName = `${exception.response.statusText.replaceAll(' ', '')}Exception`;
      exception = exception.toJSON();
      exception['name'] = exceptionName;
    }
    const { statusCode, message } = this.makeMessage(i18nLang, exception);
    request.body = this.filterSensitiveKeys(request.body);

    this.#logger.error(
      JSON.stringify({
        method: request.method,
        path: request.url,
        params: request.params,
        query: request.query,
        statusCode: statusCode,
        error: message,
        ...(statusCode >= HttpStatus.INTERNAL_SERVER_ERROR
          ? { body: request.body }
          : {}),
        headers: request.headers,
      }),
    );
    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });

    this.#logger.error(exception);
    return exception;
  }

  filterSensitiveKeys(body: { [key: string]: any }) {
    const deleteKeys = ['password', 'currentPassword', 'updatePassword'];
    deleteKeys.forEach((key) => {
      delete body[key];
    });
    return body;
  }

  makeMessage(i18nLang: string, exception: any) {
    const statusCode =
      exception?.statusCode ||
      exception?.status ||
      HttpStatus.INTERNAL_SERVER_ERROR;
    const message = this.i18n.translate(`error.${exception.name}`, {
      lang: i18nLang,
      args: exception.args,
    });
    if (message === `error.${exception.name}`) {
      if (exception instanceof HttpException) {
        return {
          statusCode: exception.getStatus(),
          message: exception.message,
        };
      } else {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: this.i18n.translate(
            `error.${InternalServerErrorException.name}`,
            {
              lang: i18nLang,
              args: exception.args,
            },
          ),
        };
      }
    }
    return { statusCode, message };
  }

  getI18NLang(host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const user = request['user'] as UserPayload;
    return user?.language || I18nContext.current(host)?.lang || I18N_LANG.KO;
  }
}
