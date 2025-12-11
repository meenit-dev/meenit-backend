import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FaqService } from '../service/faq.service';
import { PostFaqBodyDto, FaqParamDto, PutFaqBodyDto } from '../dto/faq.dto';
import { SwaggerApiTag } from '@common/type';

@Controller({ path: 'bo/faqs', version: '1' })
@ApiTags(SwaggerApiTag.BACK_OFFICE, 'Support')
export class BoFaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  @ApiOperation({ summary: '공지 생성' })
  async createFaq(@Body() body: PostFaqBodyDto) {
    return this.faqService.createFaq(body);
  }

  @Put(':faqId')
  @ApiOperation({ summary: '공지 수정' })
  async updateFaq(@Param() param: FaqParamDto, @Body() body: PutFaqBodyDto) {
    return this.faqService.updateFaqById(param.faqId, body);
  }

  @Delete(':faqId')
  @ApiOperation({ summary: '공지 삭제' })
  async deleteFaq(@Param() param: FaqParamDto) {
    return this.faqService.deleteFaqById(param.faqId);
  }
}
