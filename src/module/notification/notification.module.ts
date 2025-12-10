import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { NotificationService } from './service/notification.service';
import { NotificationRepository } from './repository/notification.repository';
import { NotificationController } from './controller/notification.controller';
import { NotificationTemplate } from './entity/notification-template.entity';
import { NotificationTemplateRepository } from './repository/notification-template.repository';
import { NotificationTemplateController } from './controller/notification.template.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationTemplate])],
  providers: [
    NotificationService,
    NotificationRepository,
    NotificationTemplateRepository,
  ],
  controllers: [NotificationController, NotificationTemplateController],
  exports: [NotificationService],
})
export class NotificationModule {}
