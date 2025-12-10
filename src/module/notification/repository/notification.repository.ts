import { Injectable, Logger } from '@nestjs/common';
import { IsNull, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { Notification } from '../entity/notification.entity';
import { Order, UUID } from '@common/type';
import {
  FindNotificationsDto,
  UpdateNotificationReadAtByIdDto,
} from '../dto/notification.dto';
import { PaginationResponseDto } from '@common/repository/repository.dto';
import { subDays } from 'date-fns';

@Injectable()
export class NotificationRepository extends CommonRepository<Notification> {
  protected readonly logger = new Logger(NotificationRepository.name);

  constructor(
    @InjectRepository(Notification)
    protected readonly repository: Repository<Notification>,
  ) {
    super();
  }

  async findNotificationsPagination(
    query: FindNotificationsDto,
  ): Promise<PaginationResponseDto<Notification>> {
    return this.findAllPagination({
      where: {
        userId: query.userId,
        ...(query.isUnread ? { readAt: IsNull() } : {}),
        createdAt: MoreThanOrEqual(subDays(new Date(), 30)),
      },
      paginationOptions: { limit: query.limit, page: query.page },
      relations: {
        template: true,
      },
      order: {
        createdAt: Order.DESC,
      },
    });
  }

  async countUnReadNotificationsByUserId(userId: UUID): Promise<number> {
    return this.repository.count({
      where: {
        userId,
        readAt: IsNull(),
        createdAt: MoreThanOrEqual(subDays(new Date(), 30)),
      },
    });
  }

  async markReadAtByIdAndUser({
    id,
    userId,
  }: UpdateNotificationReadAtByIdDto): Promise<void> {
    await this.repository.update(
      {
        id: id,
        userId: userId,
        readAt: IsNull(),
      },
      {
        readAt: new Date(),
      },
    );
  }

  async clearReadAtByIdAndUser({
    id,
    userId,
  }: UpdateNotificationReadAtByIdDto): Promise<void> {
    await this.repository.update(
      {
        id,
        userId: userId,
        readAt: Not(IsNull()),
      },
      {
        readAt: null,
      },
    );
  }

  async markReadAtByUser(userId: UUID): Promise<void> {
    await this.repository.update(
      {
        userId,
        readAt: IsNull(),
      },
      {
        readAt: new Date(),
      },
    );
  }
}
