import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
const SKIP_LOG_URL = ['/health'];

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  #logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const { statusCode } = context.getArgByIndex(1);
        const { method, originalUrl, params, query } = context
          .switchToHttp()
          .getRequest<Request>();
        if (!SKIP_LOG_URL.includes(originalUrl)) {
          this.#logger.log({
            statusCode,
            method,
            path: originalUrl,
            params,
            query,
            duration: `${Date.now() - now}ms`,
          });
        }
      }),
    );
  }
}
