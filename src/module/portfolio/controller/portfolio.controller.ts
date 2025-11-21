import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PortfolioService } from '../service/portfolio.service';
import {
  GetPortfolioResponseDto,
  PostPortfoliosBodyDto,
} from '../dto/portfolio.dto';
import { ReqUser } from '@common/decorator';
import { AuthType, UserPayload } from 'src/module/auth/type/auth.type';
import { AuthUserGuard } from 'src/module/auth/guard/auth.user.guard';

@Controller({ path: 'portfolios', version: '1' })
@ApiTags('Portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @UseGuards(AuthUserGuard)
  @ApiSecurity(AuthType.USER)
  @Post()
  @ApiOperation({ summary: 'Portfolio 생성' })
  async createPortfolio(
    @ReqUser() user: UserPayload,
    @Body() body: PostPortfoliosBodyDto,
  ) {
    return new GetPortfolioResponseDto(
      await this.portfolioService.createPortfolio(user.id, body),
    );
  }
}
