import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { User } from 'src/module/user/entity/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { NotificationTemplate } from './notification-template.entity';
import { UUID } from '@common/type';

@Entity({ name: 'notification' })
@Index(['userId', 'readAt'])
export class Notification extends CommonBaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: UUID;

  @Column({ name: 'notification_template_id', type: 'uuid' })
  notificationTemplateId: UUID;

  @Column({ nullable: true, type: String })
  link?: string;

  @Column({ nullable: false, type: String })
  message: string;

  @Column({ name: 'replace_template_data', nullable: true, type: 'jsonb' })
  replaceTemplateData?: Record<string, any>;

  @Column({ name: 'read_at', nullable: true, type: Date })
  readAt?: Date;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => NotificationTemplate, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'notification_template_id' })
  template: NotificationTemplate;

  static of(createDto: {
    userId: UUID;
    notificationTemplateId: UUID;
    link?: string;
    message: string;
    replaceTemplateData?: Record<string, any>;
  }) {
    const notification = new Notification();
    notification.userId = createDto.userId;
    notification.notificationTemplateId = createDto.notificationTemplateId;
    notification.link = createDto.link;
    notification.message = createDto.message;
    notification.replaceTemplateData = createDto.replaceTemplateData;
    return notification;
  }
}
