import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FaqService } from '../service/faq.service';
import {
  GetFaqsQueryDto,
  GetFaqsResponseDto,
  FaqParamDto,
  FaqResponseDto,
} from '../dto/faq.dto';

@Controller({ path: 'faqs', version: '1' })
@ApiTags('Support')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  @ApiOperation({ summary: 'FAQ 조회' })
  @ApiOkResponse({ type: GetFaqsResponseDto })
  async getFaqs(@Query() query: GetFaqsQueryDto) {
    return new GetFaqsResponseDto(
      await this.faqService.getFaqsByCategory(query.category),
    );
  }

  @Get(':faqId')
  @ApiOperation({ summary: 'FAQ 상세 조회' })
  @ApiOkResponse({ type: FaqResponseDto })
  async getFaq(@Param() param: FaqParamDto) {
    return this.faqService.getFaqById(param.faqId);
  }
}
