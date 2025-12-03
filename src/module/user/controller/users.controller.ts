import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import {
  GetFollowUserQueryDto,
  GetFollowUserResponseDto,
  GetMyUserProfileResponseDto,
} from '../dto/user.dto';
import { UserHandleParamDto } from '@common/dto/user.dto';
import { AuthUserGuard } from 'src/module/auth/guard/auth.user.guard';
import { ReqUser } from '@common/decorator';
import { UserPayload } from 'src/module/auth/type/auth.type';

@Controller({ path: 'users', version: '1' })
@ApiTags('User')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get(':handle')
  @ApiOperation({ summary: 'user 정보 확인' })
  @ApiOkResponse({
    type: GetMyUserProfileResponseDto,
  })
  async getUser(@Param() param: UserHandleParamDto) {
    return new GetMyUserProfileResponseDto(
      await this.userService.getUserWithProfileByHandle(param.handle),
    );
  }

  @Get(':handle/follow')
  @UseGuards(AuthUserGuard)
  @ApiOperation({ summary: '팔로우 유저 리스트 조회' })
  @ApiOkResponse({
    type: GetFollowUserResponseDto,
  })
  async getUserFollow(
    @Param() param: UserHandleParamDto,
    @Query() query: GetFollowUserQueryDto,
  ) {
    await this.userService.getFollowUserByHandle(param.handle, query);
  }

  @Post(':handle/follow')
  @UseGuards(AuthUserGuard)
  @ApiOperation({ summary: 'user 팔로우 등록' })
  async followUser(
    @ReqUser() user: UserPayload,
    @Param() param: UserHandleParamDto,
  ) {
    await this.userService.followUser(user.id, param.handle);
  }

  @Delete(':handle/follow')
  @UseGuards(AuthUserGuard)
  @ApiOperation({ summary: 'user 팔로우 제거' })
  async unfollowUser(
    @ReqUser() user: UserPayload,
    @Param() param: UserHandleParamDto,
  ) {
    await this.userService.unfollowUser(user.id, param.handle);
  }
}
