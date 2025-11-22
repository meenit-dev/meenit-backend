import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PortfolioService } from '../service/portfolio.service';
import {
  GetPortfoliosResponseDto,
  GetPortfoliosQueryDto,
} from '../dto/portfolio.dto';
import { UserHandleParamDto } from 'src/module/user/dto/user.dto';

@Controller({ path: 'users/:handle/portfolios', version: '1' })
@ApiTags('User')
export class UesrPortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  @ApiOperation({ summary: 'Portfolio 리스트 조회' })
  @ApiOkResponse({
    type: GetPortfoliosResponseDto,
  })
  async getPortfoliosPaginationByUserId(
    @Param() param: UserHandleParamDto,
    @Query() query: GetPortfoliosQueryDto,
  ) {
    return new GetPortfoliosResponseDto(
      await this.portfolioService.getPortfoliosPaginationByHandle(
        param.handle,
        query,
      ),
    );
  }
}
