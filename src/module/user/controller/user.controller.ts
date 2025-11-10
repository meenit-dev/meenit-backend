import { Body, Controller, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import { AuthUserGuard } from 'src/module/auth/guard/auth.user.guard';
import { AuthType, UserPayload } from 'src/module/auth/type/auth.type';
import { PutUserInfoBodyDto, PutUserPasswordBodyDto } from '../dto/user.dto';
import { ReqUser } from '@common/decorator';

@UseGuards(AuthUserGuard)
@ApiSecurity(AuthType.USER)
@Controller({ path: 'user', version: '1' })
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Put('profile/password')
  @ApiOperation({
    summary: '비밀번호 변경',
  })
  async updatePassword(
    @ReqUser() user: UserPayload,
    @Body() body: PutUserPasswordBodyDto,
  ) {
    await this.userService.updatePassword(user, body);
    return;
  }

  @Post('profile/password/expiration-snooze')
  @ApiOperation({
    summary: '비밀번호 만료일 연장',
  })
  async updatePasswordExpirationDate(@ReqUser() user: UserPayload) {
    await this.userService.extendPasswordExpirationDate(user);
    return;
  }
}
