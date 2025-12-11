import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { InquiryService } from '../service/inquiry.service';
import { SwaggerApiTag } from '@common/type';
import { InquiryParamDto } from '../dto/inquiry.dto';
import {
  InquiryAnswerParamDto,
  PostInquiryAnswerBodyDto,
  PutInquiryAnswerBodyDto,
} from '../dto/inquiry.answer.dto';
import { AuthType } from 'src/module/auth/type/auth.type';
import { AuthAdminGuard } from 'src/module/auth/guard/auth.admin.guard';

@Controller({ path: 'bo/inquiries', version: '1' })
@ApiTags(SwaggerApiTag.BACK_OFFICE, 'Support')
@UseGuards(AuthAdminGuard)
@ApiSecurity(AuthType.ADMIN)
export class BoInquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post(':inquiryId/answers')
  @ApiOperation({ summary: '문의 답변' })
  async createInquiryAnswer(
    @Param() param: InquiryParamDto,
    @Body() body: PostInquiryAnswerBodyDto,
  ) {
    await this.inquiryService.createInquiryAnswer(param.inquiryId, body);
  }

  @Put(':inquiryId/answers/:answerId')
  @ApiOperation({ summary: '문의 답변 수정' })
  async updateInquiryAnswer(
    @Param() param: InquiryAnswerParamDto,
    @Body() body: PutInquiryAnswerBodyDto,
  ) {
    await this.inquiryService.updateInquiryAnswer(param.answerId, body);
  }
}
