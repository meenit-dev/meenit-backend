import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationService } from '../service/notification.service';
import {
  PostNotificationTemplateBodyDto,
  PutNotificationTemplateBodyDto,
} from '../dto/notification.template.dto';

@Controller({ path: 'notifications', version: '1' })
@ApiTags('Notification Template')
export class NotificationTemplateController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('templates')
  @ApiOperation({
    summary: 'Notification Template 생성',
  })
  async createNotificationTemplate(
    @Body() body: PostNotificationTemplateBodyDto,
  ) {
    await this.notificationService.createNotificationTemplate(body);
    return;
  }

  @Put('templates/:notificationTemplateId')
  @ApiOperation({
    summary: 'Notification Template 수정',
  })
  async updateNotificationTemplate(
    @Param('notificationTemplateId') notificationTemplateId: string,
    @Body() body: PutNotificationTemplateBodyDto,
  ) {
    await this.notificationService.updateNotificationTemplate(
      notificationTemplateId,
      body,
    );
    return;
  }
}
