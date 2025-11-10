import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import { AuthUserGuard } from 'src/module/auth/guard/auth.user.guard';
import { AuthType } from 'src/module/auth/type/auth.type';
import {
  GetUserProfilesBatchQueryDto,
  GetUserProfilesBatchResponseDto,
} from '../dto/user.dto';

@UseGuards(AuthUserGuard)
@ApiSecurity(AuthType.USER)
@Controller({ path: 'users', version: '1' })
@ApiTags('User')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('batch/profile')
  @ApiOperation({
    summary: '유저 프로필 리스트 조회',
  })
  @ApiOkResponse({ type: GetUserProfilesBatchResponseDto })
  async getUsersProfile(@Query() query: GetUserProfilesBatchQueryDto) {
    return new GetUserProfilesBatchResponseDto(
      await this.userService.getUsersByIdsAndIsDeleted(
        query.ids,
        query.isDeleted,
      ),
    );
  }
}
