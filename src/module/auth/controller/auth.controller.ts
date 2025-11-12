import { ReqUser } from '@common/decorator';
import { BasicJWTResponseDto, SsoSignUpQueryDto } from '../dto/auth.dto';
import { AuthService } from '../service/auth.service';
import {
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthType, SsoUserPayload, UserPayload } from '../type/auth.type';
import { AuthUserGuard } from '../guard/auth.user.guard';
import { AuthRefreshGuard } from '../guard/auth.refresh.guard';
import { IncomingHttpHeaders } from 'http';
import { GoogleGuard } from '../guard/google.guard';
import { Response } from 'express';
import { XGuard } from '../guard/x.guard';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleGuard)
  @ApiOkResponse({ type: BasicJWTResponseDto })
  async googleAuth(@Query() _query: SsoSignUpQueryDto) {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleCallback(
    @Res() res: Response,
    @Req() req,
    @ReqUser() user: SsoUserPayload,
  ) {
    const { name, redirect } = JSON.parse(
      decodeURIComponent(req.query.state),
    ) as SsoSignUpQueryDto;
    const { refreshToken } = await this.authService.signIn(user, name);
    const { origin } = new URL(redirect);
    return res.redirect(
      `${origin}/refresh?refresh=${refreshToken}&redirect=${encodeURIComponent(redirect)}`,
    );
  }

  @Get('x')
  @UseGuards(XGuard)
  @ApiOkResponse({ type: BasicJWTResponseDto })
  async xAuth(
    @ReqUser() result: any,
    @Res() res: Response,
    @Query() _query: SsoSignUpQueryDto,
  ) {
    if (result?.redirect) {
      return res.redirect(result.redirect);
    }
  }

  @Get('x/callback')
  @UseGuards(XGuard)
  @ApiCreatedResponse({
    type: BasicJWTResponseDto,
  })
  async xCallback(
    @Res() res: Response,
    @Req() req,
    @ReqUser() user: SsoUserPayload,
  ) {
    const { name, redirect } = JSON.parse(
      decodeURIComponent(req.query.state),
    ) as SsoSignUpQueryDto;
    const { refreshToken } = await this.authService.signIn(user, name);
    const { origin } = new URL(redirect);
    return res.redirect(
      `${origin}/refresh?refresh=${refreshToken}&redirect=${encodeURIComponent(redirect)}`,
    );
  }

  @UseGuards(AuthRefreshGuard)
  @ApiSecurity(AuthType.REFRESH)
  @Post('refresh')
  @ApiOperation({
    summary: 'JWT 토큰 재발급',
  })
  @ApiCreatedResponse({
    type: BasicJWTResponseDto,
  })
  async refresh(
    @ReqUser() user: UserPayload,
    @Headers() headers: IncomingHttpHeaders,
  ): Promise<BasicJWTResponseDto> {
    return this.authService.refresh(user, headers.authorization.split(' ')[1]);
  }

  @UseGuards(AuthUserGuard)
  @ApiSecurity(AuthType.USER)
  @Post('sign-out')
  @ApiOperation({
    summary: '로그아웃',
  })
  async signOut(@Headers() headers: IncomingHttpHeaders) {
    await this.authService.signOut(headers.authorization.split(' ')[1]);
    return;
  }
}
