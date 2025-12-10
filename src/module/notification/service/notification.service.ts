import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repository/notification.repository';
import {
  CreateNotificationMsgDto,
  FindNotificationsDto,
  UpdateNotificationReadAtByIdDto,
} from '../dto/notification.dto';
import { Transactional } from 'typeorm-transactional';
import { NotificationTemplateRepository } from '../repository/notification-template.repository';
import { NotificationTemplate } from '../entity/notification-template.entity';
import { Notification } from '../entity/notification.entity';
import { BadRequestError, NotFoundError } from '@common/error';
import { PaginationResponseDto } from '@common/repository/repository.dto';
import { replaceNotificationTemplate, validateTemplate } from '@common/util';
import {
  PostNotificationTemplateBodyDto,
  PutNotificationTemplateBodyDto,
} from '../dto/notification.template.dto';
import { UUID } from '@common/type';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationTemplateRepository: NotificationTemplateRepository,
  ) {}

  async createNotificationTemplate(
    createDto: PostNotificationTemplateBodyDto,
  ): Promise<void> {
    await this.notificationTemplateRepository.save(
      NotificationTemplate.of({
        code: createDto.code,
        ...createDto,
      }),
    );
  }

  @Transactional()
  async updateNotificationTemplate(
    notificationTemplateId: string,
    updateDto: PutNotificationTemplateBodyDto,
  ): Promise<void> {
    const notificationTemplate: NotificationTemplate =
      await this.notificationTemplateRepository.findOneById(
        notificationTemplateId,
      );
    if (!notificationTemplate) {
      throw new NotFoundError();
    }

    await this.notificationTemplateRepository.save(
      notificationTemplate.update(updateDto),
    );
  }

  async createNotification(
    notificationDto: CreateNotificationMsgDto,
  ): Promise<void> {
    const notificationTemplate: NotificationTemplate =
      await this.notificationTemplateRepository.findOneByCode(
        notificationDto.code,
      );
    if (!notificationTemplate) {
      throw new NotFoundError();
    }
    this.validateNotificationTemplate(notificationDto, notificationTemplate);
    await this.notificationRepository.save(
      Notification.of({
        notificationTemplateId: notificationTemplate.id,
        ...notificationDto,
        link: this.generateMessage(
          notificationTemplate.link,
          notificationDto.replaceTemplateData,
        ),
        message: this.generateMessage(
          notificationTemplate.message,
          notificationDto.replaceTemplateData,
        ),
      }),
    );
  }

  async getNotifications(
    dto: FindNotificationsDto,
  ): Promise<PaginationResponseDto<Notification>> {
    return this.notificationRepository.findNotificationsPagination(dto);
  }

  async countNotificationsByUserId(userId: UUID) {
    return this.notificationRepository.countUnReadNotificationsByUserId(userId);
  }

  async markAsRead(dto: UpdateNotificationReadAtByIdDto) {
    await this.notificationRepository.markReadAtByIdAndUser(dto);
  }

  async markAsUnRead(dto: UpdateNotificationReadAtByIdDto) {
    await this.notificationRepository.clearReadAtByIdAndUser(dto);
  }

  async markAllAsRead(userId: UUID) {
    await this.notificationRepository.markReadAtByUser(userId);
  }

  validateNotificationTemplate(
    notificationDto: CreateNotificationMsgDto,
    notificationTemplate: NotificationTemplate,
  ) {
    const isValid: boolean = validateTemplate(
      notificationTemplate.message,
      notificationDto.replaceTemplateData,
    );
    if (!isValid) {
      throw new BadRequestError();
    }
  }

  private generateMessage(
    targetStr: string,
    replaceData: Record<string, any>,
  ): string | null {
    if (!targetStr) {
      return null;
    }

    const isValid: boolean = validateTemplate(targetStr, replaceData);
    if (!isValid) {
      throw new BadRequestError();
    }

    return replaceNotificationTemplate(targetStr, replaceData);
  }
}
