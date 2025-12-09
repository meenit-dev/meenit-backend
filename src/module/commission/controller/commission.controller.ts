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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CommissionService } from '../service/commission.service';
import {
  CommissionParamDto,
  GetCommissionsResponseDto,
  GetCommissionResponseDto,
  GetCommissionsQueryDto,
  PostCommissionBodyDto,
  PatchCommissionBodyDto,
} from '../dto/commission.dto';
import { ReqUser } from '@common/decorator';
import { AuthType, UserPayload } from 'src/module/auth/type/auth.type';
import { AuthUserGuard } from 'src/module/auth/guard/auth.user.guard';

@Controller({ path: 'commissions', version: '1' })
@ApiTags('Commission')
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @UseGuards(AuthUserGuard)
  @ApiSecurity(AuthType.USER)
  @Post()
  @ApiCreatedResponse({
    type: GetCommissionResponseDto,
  })
  async createCommission(
    @ReqUser() user: UserPayload,
    @Body() body: PostCommissionBodyDto,
  ) {
    return new GetCommissionResponseDto(
      await this.commissionService.createCommission(user.id, body),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Commission 리스트 조회' })
  @ApiOkResponse({
    type: GetCommissionsResponseDto,
  })
  async getCommissionsPaginationByHandle(
    @Query() query: GetCommissionsQueryDto,
  ) {
    return new GetCommissionsResponseDto(
      await this.commissionService.getCommissionsPagination(query),
    );
  }

  @Get(':commissionId')
  @ApiOperation({ summary: 'Commission 상세 조회' })
  @ApiOkResponse({
    type: GetCommissionResponseDto,
  })
  async getCommission(@Param() param: CommissionParamDto) {
    return new GetCommissionResponseDto(
      await this.commissionService.getCommissionWithUserAndTagById(
        param.commissionId,
      ),
    );
  }

  @UseGuards(AuthUserGuard)
  @ApiSecurity(AuthType.USER)
  @Patch(':commissionId')
  @ApiOperation({ summary: 'Commission 수정' })
  @ApiOkResponse({
    type: GetCommissionResponseDto,
  })
  async updateCommission(
    @ReqUser() user: UserPayload,
    @Param() param: CommissionParamDto,
    @Body() body: PatchCommissionBodyDto,
  ) {
    return new GetCommissionResponseDto(
      await this.commissionService.updatecommissionByIdAndUserId(
        param.commissionId,
        user.id,
        body,
      ),
    );
  }

  @UseGuards(AuthUserGuard)
  @ApiSecurity(AuthType.USER)
  @Delete(':commissionId')
  @ApiOperation({ summary: 'Commission 삭제' })
  async deleteCommission(
    @ReqUser() user: UserPayload,
    @Param() param: CommissionParamDto,
  ) {
    await this.commissionService.deleteCommissionByIdAndUserId(
      param.commissionId,
      user.id,
    );
  }
}
