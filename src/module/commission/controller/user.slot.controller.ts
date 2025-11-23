import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { SlotService } from '../service/slot.service';
import {
  GetSlotsResponseDto,
  PatchSlotBodyDto,
  SlotIdtParamDto,
} from '../dto/slot.dto';
import { AuthUserGuard } from 'src/module/auth/guard/auth.user.guard';
import { AuthType, UserPayload } from 'src/module/auth/type/auth.type';
import { ReqUser } from '@common/decorator';
import { UserHandleParamDto } from '@common/dto/user.dto';

@Controller({ path: 'users/:handle/slots', version: '1' })
@ApiTags('User')
export class UserSlotController {
  constructor(private readonly slotService: SlotService) {}

  @Get()
  @ApiOperation({ summary: 'slot 리스트 조회' })
  @ApiOkResponse({
    type: GetSlotsResponseDto,
  })
  async getSlotsByHandle(@Param() param: UserHandleParamDto) {
    return new GetSlotsResponseDto(
      await this.slotService.getSlotsByHandle(param.handle),
    );
  }

  @Patch(':slotId')
  @UseGuards(AuthUserGuard)
  @ApiSecurity(AuthType.USER)
  @ApiOperation({ summary: 'slot 정보 수정' })
  async updateSlot(
    @ReqUser() user: UserPayload,
    @Param() param: SlotIdtParamDto,
    @Body() body: PatchSlotBodyDto,
  ) {
    await this.slotService.updateSlotByIdAndUserId(param.slotId, user.id, body);
  }
}
