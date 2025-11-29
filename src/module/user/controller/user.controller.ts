import { Body, Controller, Get, Patch, Put, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import { AuthUserGuard } from 'src/module/auth/guard/auth.user.guard';
import { AuthType, UserPayload } from 'src/module/auth/type/auth.type';
import {
  GetMyUserProfileResponseDto,
  UserResponseDto,
  GetUserAccountResponseDto,
  PatchUserInfoBodyDto,
  PutUserAccountBodyDto,
  PutUserPhoneBodyDto,
  GetCreatorSettingResponseDto,
  PatchCreatorSettingBodyDto,
} from '../dto/user.dto';
import { ReqUser } from '@common/decorator';

@UseGuards(AuthUserGuard)
@ApiSecurity(AuthType.USER)
@Controller({ path: 'user', version: '1' })
@ApiTags('Me')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'user 정보 확인' })
  @ApiOkResponse({
    type: UserResponseDto,
  })
  async me(@ReqUser() user: UserPayload) {
    return new UserResponseDto(await this.userService.getUserById(user.id));
  }

  @Get('me/profile')
  @ApiOperation({ summary: 'user 프로필 정보 확인' })
  @ApiOkResponse({
    type: GetMyUserProfileResponseDto,
  })
  async getUserInfo(@ReqUser() user: UserPayload) {
    return new GetMyUserProfileResponseDto(
      await this.userService.getUserWithProfileById(user.id),
    );
  }

  @Patch('me/profile')
  @ApiOperation({
    summary: '유저 정보 변경',
  })
  async updateUserInfo(
    @ReqUser() user: UserPayload,
    @Body() body: PatchUserInfoBodyDto,
  ) {
    await this.userService.updateUserInfo(user, body);
    return;
  }

  @Put('me/phone')
  @ApiOperation({ summary: '전화번호 등록/변경' })
  async updateUserPhone(
    @ReqUser() user: UserPayload,
    @Body() body: PutUserPhoneBodyDto,
  ) {
    await this.userService.updateUserPhone(user.id, body.phone);
  }

  @Put('me/account')
  @ApiOperation({ summary: '계좌 정보 등록/변경' })
  async updateUserAccount(
    @ReqUser() user: UserPayload,
    @Body() body: PutUserAccountBodyDto,
  ) {
    await this.userService.updateUserAccount(user.id, body);
  }

  @Get('me/account')
  @ApiOperation({ summary: '계좌 정보 조회' })
  @ApiOkResponse({ type: GetUserAccountResponseDto })
  async getUserAccount(@ReqUser() user: UserPayload) {
    return new GetUserAccountResponseDto(
      await this.userService.getUserAccountByUserId(user.id),
    );
  }

  @Get('me/settings/creator')
  @ApiOperation({ summary: '크리에이터 설정 조회' })
  @ApiOkResponse({ type: GetCreatorSettingResponseDto })
  async getCreatorSetting(@ReqUser() user: UserPayload) {
    return new GetCreatorSettingResponseDto(
      await this.userService.getUserWithCreatorSettingById(user.id),
    );
  }

  @Patch('me/settings/creator')
  @ApiOperation({ summary: '크리에이터 설정 수정' })
  async updateCreatorSetting(
    @ReqUser() user: UserPayload,
    @Body() body: PatchCreatorSettingBodyDto,
  ) {
    await this.userService.updateCreatorSetting(user.id, body);
  }
}
