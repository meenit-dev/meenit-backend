import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommissionService } from '../service/commission.service';
import {
  GetCommissionsResponseDto,
  GetCommissionsQueryDto,
} from '../dto/commission.dto';
import { UserHandleParamDto } from '@common/dto/user.dto';

@Controller({ path: 'users/:handle/commissions', version: '1' })
@ApiTags('User')
export class UserCommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @Get()
  @ApiOperation({ summary: 'Commission 리스트 조회' })
  @ApiOkResponse({
    type: GetCommissionsResponseDto,
  })
  async getCommissionsPaginationByHandle(
    @Param() param: UserHandleParamDto,
    @Query() query: GetCommissionsQueryDto,
  ) {
    return new GetCommissionsResponseDto(
      await this.commissionService.getCommissionsPaginationByHandle(
        param.handle,
        query,
      ),
    );
  }
}
