import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as rTracer from 'cls-rtracer';
import { IsProduction } from '@common/util';

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: IsProduction ? 'http' : 'silly',
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike('Nest', {
          prettyPrint: true,
          colors: true,
        }),
      ),
    }),
  ],
  format: winston.format.combine(
    winston.format((info) => {
      info.traceId = rTracer.id();
      return info;
    })(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json(),
  ),
});
