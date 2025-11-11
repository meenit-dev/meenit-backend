import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import { AuthUserGuard } from 'src/module/auth/guard/auth.user.guard';
import { AuthType, UserPayload } from 'src/module/auth/type/auth.type';
import { GetMyUserResponseDto, PutUserInfoBodyDto } from '../dto/user.dto';
import { ReqUser } from '@common/decorator';

@UseGuards(AuthUserGuard)
@ApiSecurity(AuthType.USER)
@Controller({ path: 'user', version: '1' })
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthUserGuard)
  @ApiSecurity(AuthType.USER)
  @Get('me')
  @ApiOperation({
    summary: 'user 정보 확인',
  })
  @ApiOkResponse({
    type: GetMyUserResponseDto,
  })
  async me(@ReqUser() user: UserPayload) {
    return new GetMyUserResponseDto(
      await this.userService.getUserById(user.id),
    );
  }

  @Patch('profile')
  @ApiOperation({
    summary: '유저 정보 변경',
  })
  async updateUserInfo(
    @ReqUser() user: UserPayload,
    @Body() body: PutUserInfoBodyDto,
  ) {
    await this.userService.updateUserInfo(user, body);
    return;
  }
}
