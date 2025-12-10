import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { NotificationTemplate } from '../entity/notification-template.entity';
import { NotificationCode } from '../type/notification.type';

@Injectable()
export class NotificationTemplateRepository extends CommonRepository<NotificationTemplate> {
  protected readonly logger = new Logger(NotificationTemplateRepository.name);

  constructor(
    @InjectRepository(NotificationTemplate)
    protected readonly repository: Repository<NotificationTemplate>,
  ) {
    super();
  }

  async findOneByCode(code: NotificationCode) {
    return this.repository.findOne({
      where: { code },
    });
  }
}
