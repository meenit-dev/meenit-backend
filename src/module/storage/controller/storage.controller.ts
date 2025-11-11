import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { StorageService } from '../service/storage.service';
import { AuthUserGuard } from 'src/module/auth/guard/auth.user.guard';
import { AuthType, UserPayload } from 'src/module/auth/type/auth.type';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ReqUser } from '@common/decorator';
import { PostPreSignedUrlBodyDto } from '../dto/storage.dto';

@UseGuards(AuthUserGuard)
@ApiSecurity(AuthType.USER)
@ApiTags('Stroage')
@Controller({ path: 'storage', version: '1' })
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('pre-signed')
  async getUploadUrl(
    @ReqUser() user: UserPayload,
    @Body() body: PostPreSignedUrlBodyDto,
  ) {
    console.log(user);
    return this.storageService.getUploadPostUrl(
      user,
      body.type,
      body.mimeType,
      body.extention,
    );
  }
}
