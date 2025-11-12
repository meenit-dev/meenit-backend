import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { StorageService } from '../service/storage.service';
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
  PutPreSignedUrlBodyDto,
  PutPreSignedUrlResponseDto,
} from '../dto/storage.dto';

@UseGuards(AuthUserGuard)
@ApiSecurity(AuthType.USER)
@ApiTags('Stroage')
@Controller({ path: 'storage', version: '1' })
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Put('pre-signed')
  @ApiOperation({
    summary: 'Presigned Url 발급',
  })
  @ApiOkResponse({ type: PutPreSignedUrlResponseDto })
  async getUploadUrl(
    @ReqUser() user: UserPayload,
    @Body() body: PutPreSignedUrlBodyDto,
  ) {
    return this.storageService.getUploadPostUrl(
      user,
      body.type,
      body.mimeType,
      body.extention,
      body.contentLength,
    );
  }
}
