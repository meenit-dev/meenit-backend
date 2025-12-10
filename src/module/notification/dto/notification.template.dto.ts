import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { NotificationCode, NotificationType } from '../type/notification.type';

export class PostNotificationTemplateBodyDto {
  @ApiProperty({
    description: '알람 전송시 사용할 code 이름',
    example: 'SIGN_UP_01',
  })
  @IsString()
  code: NotificationCode;

  @ApiProperty({
    description: '알람의 종류',
    example: NotificationType.COMMISSION,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: '클릭시 이동할 링크',
    example: 'https://meenit.co',
    required: false,
  })
  @IsString()
  @IsOptional()
  link?: string;

  @ApiProperty({
    description: '메세지 내용',
    example: '메세지 내용. {name} 등으로 치환 가능',
  })
  @IsString()
  message: string;
}

export class PutNotificationTemplateBodyDto extends PickType(
  PostNotificationTemplateBodyDto,
  ['type', 'link', 'message'] as const,
) {}
