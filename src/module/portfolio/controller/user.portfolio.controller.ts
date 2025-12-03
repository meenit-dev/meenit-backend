import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PortfolioService } from '../service/portfolio.service';
import {
  GetPortfoliosResponseDto,
  GetPortfoliosQueryDto,
} from '../dto/portfolio.dto';
import { UserHandleParamDto } from '@common/dto/user.dto';
import { ReqUser } from '@common/decorator';
import { UserPayload } from 'src/module/auth/type/auth.type';

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
    @ReqUser() user: UserPayload,
  ) {
    return new GetPortfoliosResponseDto(
      await this.portfolioService.getPortfoliosPaginationByHandle(
        param.handle,
        user?.id,
        query,
      ),
    );
  }
}
