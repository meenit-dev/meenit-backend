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
  ApiExcludeEndpoint,
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
import { NotFoundError } from '@common/error';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleGuard)
  async googleAuth(@Query() _query: SsoSignUpQueryDto) {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  @ApiExcludeEndpoint()
  async googleCallback(
    @Res() res: Response,
    @Req() req,
    @ReqUser() user: SsoUserPayload,
  ) {
    const { name, redirect, failedRedirect } = JSON.parse(
      decodeURIComponent(req.query.state),
    ) as SsoSignUpQueryDto;
    try {
      const { origin } = new URL(redirect);
      const { refreshToken } = await this.authService.signIn(user, name);
      return res.redirect(
        `${origin}/login/success?refresh=${refreshToken}&redirect=${encodeURIComponent(redirect)}`,
      );
    } catch (error) {
      const { origin } = new URL(failedRedirect);
      const requiredSignUp = error instanceof NotFoundError;
      return res.redirect(
        `${origin}/login/fail?requiredSignUp=${requiredSignUp}&redirect=${encodeURIComponent(failedRedirect)}`,
      );
    }
  }

  @Get('x')
  @UseGuards(XGuard)
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
  @ApiExcludeEndpoint()
  async xCallback(
    @Res() res: Response,
    @Req() req,
    @ReqUser() user: SsoUserPayload,
  ) {
    const { name, redirect, failedRedirect } = JSON.parse(
      decodeURIComponent(req.query.state),
    ) as SsoSignUpQueryDto;
    try {
      const { origin } = new URL(redirect);
      const { refreshToken } = await this.authService.signIn(user, name);
      return res.redirect(
        `${origin}/login/success?refresh=${refreshToken}&redirect=${encodeURIComponent(redirect)}`,
      );
    } catch (error) {
      const { origin } = new URL(failedRedirect);
      const requiredSignUp = error instanceof NotFoundError;
      return res.redirect(
        `${origin}/login/fail?requiredSignUp=${requiredSignUp}&redirect=${encodeURIComponent(failedRedirect)}`,
      );
    }
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
