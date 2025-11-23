import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import {
  GetMyUserProfileResponseDto,
  GetUsersQueryDto,
  GetCreatorsResponseDto,
} from '../dto/user.dto';
import { UserHandleParamDto } from '@common/dto/user.dto';

@Controller({ path: 'users', version: '1' })
@ApiTags('User')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'creator 리스트 조회' })
  @ApiOkResponse({
    type: GetCreatorsResponseDto,
  })
  async getCreators(@Query() query: GetUsersQueryDto) {
    return new GetCreatorsResponseDto(
      await this.userService.getCreatorPagination(query),
    );
  }

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
}
