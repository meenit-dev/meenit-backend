import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthUserGuard } from 'src/module/auth/guard/auth.user.guard';
import { AuthType, UserPayload } from 'src/module/auth/type/auth.type';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ReqUser } from '@common/decorator';
import {
  GetUserStorageInfoResponseDto,
  PutPreSignedUrlBodyDto,
  PutPreSignedUrlResponseDto,
} from '../dto/storage.dto';
import { ResourceService } from '../service/resource.service';

@UseGuards(AuthUserGuard)
@ApiSecurity(AuthType.USER)
@ApiTags('Stroage')
@Controller({ path: 'storage', version: '1' })
export class StorageController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get('info')
  @ApiOperation({
    summary: '사용중인 스토리지 정보 조회(포트폴리오 원본 파일 기준)',
  })
  @ApiOkResponse({ type: GetUserStorageInfoResponseDto })
  async getUserStorageInfo(
    @ReqUser() user: UserPayload,
  ): Promise<GetUserStorageInfoResponseDto> {
    return this.resourceService.getUserStorageInfo(user.id);
  }

  @Put('pre-signed')
  @ApiOperation({
    summary: 'Presigned Url 발급',
  })
  @ApiOkResponse({ type: PutPreSignedUrlResponseDto })
  async getUploadUrl(
    @ReqUser() user: UserPayload,
    @Body() body: PutPreSignedUrlBodyDto,
  ) {
    return this.resourceService.getResourceTicket(user, body);
  }
}
