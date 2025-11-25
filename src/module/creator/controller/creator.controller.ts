import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  GetCreatorsResponseDto,
  GetCreatorsQueryDto,
} from '../dto/creator.dto';
import { CreatorService } from '../service/creator.service';

@ApiTags('Creator')
@Controller({ path: 'creators', version: '1' })
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) {}

  @Get()
  @ApiOperation({ summary: 'creator 리스트 조회' })
  @ApiOkResponse({
    type: GetCreatorsResponseDto,
  })
  async getCreators(@Query() query: GetCreatorsQueryDto) {
    return new GetCreatorsResponseDto(
      await this.creatorService.getCreatorPagination(query),
    );
  }
}
