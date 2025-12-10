import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { NotificationCode, NotificationType } from '../type/notification.type';
import { PaginationDto } from '@common/dto';
import { Notification } from '../entity/notification.entity';
import { UUID } from '@common/type';

export class NotificationIdParamDto {
  @ApiProperty({
    description: 'notification 아이디',
    example: 'notificationId',
  })
  @IsUUID()
  notificationId: string;
}

export class CreateNotificationMsgDto {
  @ApiProperty({
    description: 'receiver Id',
  })
  @IsUUID()
  userId: UUID;

  @ApiProperty({
    description: 'code',
  })
  @IsEnum(NotificationCode)
  code: NotificationCode;

  @ApiProperty({
    description: 'replaceTemplateData',
    required: false,
    example: {
      name: '홍길동',
    },
  })
  @IsOptional()
  @IsObject()
  replaceTemplateData?: Record<string, any>;
}

export class GetNotificationsQueryDto extends PaginationDto {
  @ApiProperty({
    description: '조회 여부',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform((value) => {
    return value.value == 'true';
  })
  isUnread?: boolean;
}

class UserNotificationDto {
  @ApiProperty({
    description: 'notification 고유 아이디',
    example: 'notification 1',
  })
  id: string;

  @ApiProperty({
    description: '생성 시간',
    example: '2024-04-12T07:31:57.939+00:00',
  })
  createdAt: Date;

  @ApiProperty({
    description: '조회 시간',
    example: '2024-04-12T07:31:57.939+00:00',
    required: false,
  })
  readAt?: Date;

  @ApiProperty({
    description: '메세지 내용',
    example: '홍길동님이 가입하셨습니다.',
  })
  message: string;

  @ApiProperty({
    description: '알림 클릭 시 이동할 링크 uri',
    example: 'https://meenit.co',
    required: false,
  })
  link?: string;

  @ApiProperty({
    description: '알림 type',
    example: NotificationType.COMMISSION,
  })
  type: NotificationType;

  constructor(notification: Notification) {
    this.id = notification.id;
    this.createdAt = notification.createdAt;
    this.readAt = notification.readAt;
    this.message = notification.message;
    this.link = notification.link;
    this.type = notification.template.type;
  }
}

export class GetNotificationsResponseDto {
  @ApiProperty({
    description: 'notification 리스트',
    type: [UserNotificationDto],
  })
  list: UserNotificationDto[];

  @ApiProperty({
    description: '데이터 개수',
    example: 120,
  })
  totalCount: number;

  constructor({
    list,
    totalCount,
  }: {
    list: Notification[];
    totalCount: number;
  }) {
    this.list = list.map(
      (notification) => new UserNotificationDto(notification),
    );
    this.totalCount = totalCount;
  }
}

export class GetNotificationsCountResponseDto {
  @ApiProperty({
    description: '데이터 개수',
    example: 120,
  })
  totalCount: number;

  constructor({ totalCount }: { totalCount: number }) {
    this.totalCount = totalCount;
  }
}

export interface FindNotificationsDto extends PaginationDto {
  userId: string;
  isUnread?: boolean;
}

export interface UpdateNotificationReadAtByIdDto {
  id: string;
  userId: string;
}
