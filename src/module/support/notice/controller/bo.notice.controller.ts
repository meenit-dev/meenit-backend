import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { NoticeService } from '../service/notice.service';
import {
  PostNoticeBodyDto,
  NoticeParamDto,
  PutNoticeBodyDto,
} from '../dto/notice.dto';
import { SwaggerApiTag } from '@common/type';
import { AuthAdminGuard } from 'src/module/auth/guard/auth.admin.guard';
import { AuthType } from 'src/module/auth/type/auth.type';

@Controller({ path: 'bo/notices', version: '1' })
@ApiTags(SwaggerApiTag.BACK_OFFICE, 'Support')
@UseGuards(AuthAdminGuard)
@ApiSecurity(AuthType.ADMIN)
export class BoNoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post()
  @ApiOperation({ summary: '공지 생성' })
  async createNotice(@Body() body: PostNoticeBodyDto) {
    return this.noticeService.createNotice(body);
  }

  @Put(':noticeId')
  @ApiOperation({ summary: '공지 수정' })
  async updateNotice(
    @Param() param: NoticeParamDto,
    @Body() body: PutNoticeBodyDto,
  ) {
    return this.noticeService.updateNoticeById(param.noticeId, body);
  }

  @Delete(':noticeId')
  @ApiOperation({ summary: '공지 삭제' })
  async deleteNotice(@Param() param: NoticeParamDto) {
    return this.noticeService.deleteNoticeById(param.noticeId);
  }
}
