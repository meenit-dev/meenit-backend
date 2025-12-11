import { ReqUser } from '@common/decorator';
import { BasicJWTResponseDto } from '../dto/auth.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthType, UserPayload } from '../type/auth.type';
import { SwaggerApiTag } from '@common/type';
import { AuthAdminRefreshGuard } from '../guard/auth.admin.refresh.guard';
import { AdminAuthService } from '../service/admin.auth.service';
import { AdminSignInBodyDto } from '../dto/admin.auth.dto';

@Controller({ path: 'bo/auth', version: '1' })
@ApiTags(SwaggerApiTag.BACK_OFFICE, 'Auth')
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @Post('sign-in')
  @ApiOperation({ summary: '로그인' })
  @ApiCreatedResponse({ type: BasicJWTResponseDto })
  async signUp(@Body() body: AdminSignInBodyDto) {
    return this.authService.signIn(body);
  }

  @UseGuards(AuthAdminRefreshGuard)
  @ApiSecurity(AuthType.ADMIN_REFRESH)
  @Post('refresh')
  @ApiOperation({ summary: 'JWT 토큰 재발급' })
  @ApiCreatedResponse({ type: BasicJWTResponseDto })
  async refresh(@ReqUser() user: UserPayload): Promise<BasicJWTResponseDto> {
    return this.authService.refresh(user.id);
  }
}
