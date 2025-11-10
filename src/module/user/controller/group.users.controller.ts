import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
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
  GetGroupUsersQueryDto,
  GetUserProfilesResponseDto,
} from '../dto/user.dto';
import { GroupParamDto } from '@common/dto';

@UseGuards(AuthUserGuard)
@ApiSecurity(AuthType.USER)
@Controller({ path: 'groups/:groupId/users', version: '1' })
@ApiTags('User')
export class GroupUsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: '유저 프로필 리스트 조회',
  })
  @ApiOkResponse({ type: GetUserProfilesResponseDto })
  async getUsers(
    @Param() param: GroupParamDto,
    @Query() query: GetGroupUsersQueryDto,
  ) {
    return new GetUserProfilesResponseDto(
      await this.userService.getGroupUsers({
        groupId: param.groupId,
        ...query,
      }),
    );
  }
}
