import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import { GetMyUserProfileResponseDto } from '../dto/user.dto';
import { UserHandleParamDto } from '@common/dto/user.dto';

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
}
