import {
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { NotificationService } from '../service/notification.service';
import {
  GetNotificationsCountResponseDto,
  GetNotificationsQueryDto,
  GetNotificationsResponseDto,
  NotificationIdParamDto,
} from '../dto/notification.dto';
import { ReqUser } from '@common/decorator';
import { AuthType, UserPayload } from 'src/module/auth/type/auth.type';
import { AuthUserGuard } from 'src/module/auth/guard/auth.user.guard';

@Controller({ path: 'notifications', version: '1' })
@ApiTags('Notification')
@UseGuards(AuthUserGuard)
@ApiSecurity(AuthType.USER)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Notification 리스트 조회' })
  @ApiOkResponse({ type: GetNotificationsResponseDto })
  async getNotifications(
    @ReqUser() user: UserPayload,
    @Query() query: GetNotificationsQueryDto,
  ): Promise<GetNotificationsResponseDto> {
    return new GetNotificationsResponseDto(
      await this.notificationService.getNotifications({
        userId: user.id,
        ...query,
      }),
    );
  }

  @Get('count')
  @ApiOperation({ summary: '읽지 않은 Notification 개수 조회' })
  @ApiOkResponse({
    type: GetNotificationsCountResponseDto,
  })
  async getUnReadNotificationsCount(
    @ReqUser() user: UserPayload,
  ): Promise<GetNotificationsCountResponseDto> {
    return new GetNotificationsCountResponseDto({
      totalCount: await this.notificationService.countNotificationsByUserId(
        user.id,
      ),
    });
  }

  @Put(':notificationId/read')
  @ApiOperation({ summary: 'Notification 읽음 처리' })
  async markNotificationAsRead(
    @ReqUser() user: UserPayload,
    @Param() param: NotificationIdParamDto,
  ): Promise<void> {
    await this.notificationService.markAsRead({
      userId: user.id,
      id: param.notificationId,
    });
    return;
  }

  @Delete(':notificationId/read')
  @ApiOperation({ summary: 'Notification 안읽음 처리' })
  async markNotificationAsUnRead(
    @ReqUser() user: UserPayload,
    @Param() param: NotificationIdParamDto,
  ): Promise<void> {
    await this.notificationService.markAsUnRead({
      userId: user.id,
      id: param.notificationId,
    });
    return;
  }

  @Put('read')
  @ApiOperation({ summary: 'Notification 전체 읽음 처리' })
  async markAllNotificationAsRead(@ReqUser() user: UserPayload): Promise<void> {
    await this.notificationService.markAllAsRead(user.id);
    return;
  }
}
