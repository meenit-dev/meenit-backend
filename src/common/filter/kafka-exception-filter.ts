import { Catch, ArgumentsHost, ExceptionFilter, Logger } from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';

@Catch()
export class KafkaExceptionFilter implements ExceptionFilter {
  private logger = new Logger(KafkaExceptionFilter.name);

  async catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToRpc().getContext<KafkaContext>();
    this.logger.log(
      JSON.stringify({
        topic: context.getTopic(),
        partition: context.getPartition(),
        message: context.getMessage(),
      }),
    );
    this.logger.error(exception);
    return exception;
  }
}
