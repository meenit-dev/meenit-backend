import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InquiryService } from '../service/inquiry.service';
import {
  GetInquiriesQueryDto,
  GetInquiriesResponseDto,
  InquiryParamDto,
  InquiryResponseDto,
  PostInquiryBodyDto,
} from '../dto/inquiry.dto';
import { AuthUserGuard } from 'src/module/auth/guard/auth.user.guard';
import { ReqUser } from '@common/decorator';
import { UserPayload } from 'src/module/auth/type/auth.type';

@Controller({ path: 'inquiries', version: '1' })
@ApiTags('Support')
@UseGuards(AuthUserGuard)
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Get()
  @ApiOperation({ summary: '문의 조회' })
  @ApiOkResponse({ type: GetInquiriesResponseDto })
  async getInquiries(
    @ReqUser() user: UserPayload,
    @Query() query: GetInquiriesQueryDto,
  ) {
    return new GetInquiriesResponseDto(
      await this.inquiryService.getInquiriesPaginationByUserId(user.id, query),
    );
  }

  @Get(':inquiryId')
  @ApiOperation({ summary: '문의 상세 조회' })
  @ApiOkResponse({ type: InquiryResponseDto })
  async getInquiry(
    @ReqUser() user: UserPayload,
    @Param() param: InquiryParamDto,
  ) {
    return this.inquiryService.getInquiryWithAnswerByUserIdAndId(
      user.id,
      param.inquiryId,
    );
  }

  @Post()
  @ApiOperation({ summary: '문의 생성' })
  async createInquiry(
    @ReqUser() user: UserPayload,
    @Body() body: PostInquiryBodyDto,
  ) {
    return this.inquiryService.createInquiry(user.id, body);
  }
}
