import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity } from 'typeorm';
import { NotificationCode, NotificationType } from '../type/notification.type';

@Entity({ name: 'notification_template' })
export class NotificationTemplate extends CommonBaseEntity {
  @Column({ type: String, enum: NotificationCode })
  code: NotificationCode;

  @Column({ type: String, nullable: true })
  link?: string;

  @Column({ type: String, enum: NotificationType })
  type: NotificationType;

  @Column({ type: String })
  message: string;

  static of(createDto: {
    code: NotificationCode;
    type: NotificationType;
    link?: string;
    message: string;
  }) {
    const notificationTemplate = new NotificationTemplate();
    notificationTemplate.code = createDto.code;
    notificationTemplate.type = createDto.type;
    notificationTemplate.link = createDto.link ?? null;
    notificationTemplate.message = createDto.message;
    return notificationTemplate;
  }

  update(updateDto: {
    type: NotificationType;
    link?: string;
    message: string;
  }) {
    this.type = updateDto.type;
    this.link = updateDto.link ?? null;
    this.message = updateDto.message;
    return this;
  }
}
