import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoticeService } from '../service/notice.service';
import {
  GetNoticesQueryDto,
  GetNoticesResponseDto,
  NoticeParamDto,
  NoticeResponseDto,
} from '../dto/notice.dto';

@Controller({ path: 'notices', version: '1' })
@ApiTags('Support')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  @ApiOperation({ summary: '공지 리스트 조회' })
  @ApiOkResponse({ type: GetNoticesResponseDto })
  async getNotices(@Query() query: GetNoticesQueryDto) {
    return new GetNoticesResponseDto(
      await this.noticeService.getNoticePagination(query),
    );
  }

  @Get(':noticeId')
  @ApiOperation({ summary: '공지 상세 조회' })
  @ApiOkResponse({ type: NoticeResponseDto })
  async getNotice(@Param() param: NoticeParamDto) {
    return this.noticeService.getNoticeById(param.noticeId);
  }
}
