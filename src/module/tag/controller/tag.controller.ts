import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagService } from '../service/tag.service';
import { GetTagsQueryDto, GetTagsResponseDto } from '../dto/tag.dto';

@Controller({ path: 'tags', version: '1' })
@ApiTags('Tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({ summary: 'tag 리스트 조회' })
  @ApiOkResponse({
    type: GetTagsResponseDto,
  })
  async getUsedTop20TagsByName(@Query() { name }: GetTagsQueryDto) {
    return new GetTagsResponseDto(
      await this.tagService.getUsedTop20TagsByName(name),
    );
  }
}
