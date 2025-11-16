import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PortfolioService } from '../service/portfolio.service';
import {
  PortfolioParamDto,
  GetPortfoliosResponseDto,
  GetPortfolioResponseDto,
  GetPortfoliosQueryDto,
  PostPortfoliosBodyDto,
  PatchPortfoliosBodyDto,
} from '../dto/portfolio.dto';
import { UserHandleParamDto } from 'src/module/user/dto/user.dto';
import { ReqUser } from '@common/decorator';
import { AuthType, UserPayload } from 'src/module/auth/type/auth.type';
import { AuthUserGuard } from 'src/module/auth/guard/auth.user.guard';

@Controller({ path: 'users/:handle/portfolios', version: '1' })
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

  @Get(':portfolioId')
  @ApiOperation({ summary: 'Portfolio 상세 조회' })
  @ApiOkResponse({
    type: GetPortfoliosResponseDto,
  })
  async getPortfolio(@Param() param: PortfolioParamDto) {
    return new GetPortfolioResponseDto(
      await this.portfolioService.getPortfolioAndIncreseViewCountById(
        param.portfolioId,
      ),
    );
  }

  @UseGuards(AuthUserGuard)
  @ApiSecurity(AuthType.USER)
  @Patch(':portfolioId')
  @ApiOperation({ summary: 'Portfolio 수정' })
  @ApiOkResponse({
    type: GetPortfoliosResponseDto,
  })
  async updatePortfolio(
    @ReqUser() user: UserPayload,
    @Param() param: PortfolioParamDto,
    @Body() body: PatchPortfoliosBodyDto,
  ) {
    return new GetPortfolioResponseDto(
      await this.portfolioService.updatePortfolioByIdAndUserId(
        param.portfolioId,
        user.id,
        body,
      ),
    );
  }

  @UseGuards(AuthUserGuard)
  @ApiSecurity(AuthType.USER)
  @Delete(':portfolioId')
  @ApiOperation({ summary: 'Portfolio 삭제' })
  async deletePortfolio(
    @ReqUser() user: UserPayload,
    @Param() param: PortfolioParamDto,
  ) {
    await this.portfolioService.deletePortfolioByIdAndUserId(
      param.portfolioId,
      user.id,
    );
  }

  @UseGuards(AuthUserGuard)
  @ApiSecurity(AuthType.USER)
  @Post(':portfolioId/like')
  @ApiOperation({ summary: 'Portfolio 좋아요 추가' })
  async createPortfoliolLike(
    @ReqUser() user: UserPayload,
    @Param() param: PortfolioParamDto,
  ) {
    await this.portfolioService.createPortfolioLike(param.portfolioId, user.id);
  }

  @UseGuards(AuthUserGuard)
  @ApiSecurity(AuthType.USER)
  @Delete(':portfolioId/like')
  @ApiOperation({ summary: 'Portfolio 좋아요 삭제' })
  async deletePortfoliolLike(
    @ReqUser() user: UserPayload,
    @Param() param: PortfolioParamDto,
  ) {
    await this.portfolioService.deletePortfolioLike(param.portfolioId, user.id);
  }
}
