import { ReqUser } from '@common/decorator';
import {
  BasicJWTResponseDto,
  PostEmailCodeBodyDto,
  PostEmailCodeValidationBodyDto,
  SsoSignUpBodyDto,
  SsoSignInQueryDto,
} from '../dto/auth.dto';
import { AuthService } from '../service/auth.service';
import {
  Body,
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

  @Get('test-token')
  async testToken(@Query('handle') handle: string) {
    return this.authService.testMakeToken(handle);
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  async googleAuth(@Query() _query: SsoSignInQueryDto) {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  @ApiExcludeEndpoint()
  async googleCallback(
    @Res() res: Response,
    @Req() req,
    @ReqUser() user: SsoUserPayload,
  ) {
    const { redirect, failedRedirect } = JSON.parse(
      decodeURIComponent(req.query.state),
    ) as SsoSignInQueryDto;
    try {
      const { origin } = new URL(redirect);
      const { refreshToken } = await this.authService.signIn(user);
      return res.redirect(
        `${origin}/login/success?refresh=${refreshToken}&redirect=${encodeURIComponent(redirect)}`,
      );
    } catch (error) {
      const { origin } = new URL(failedRedirect);
      const requiredSignUp = error instanceof NotFoundError;
      return res.redirect(
        `${origin}/login/fail?requiredSignUp=${requiredSignUp}&redirect=${encodeURIComponent(failedRedirect)}&provider=${user.provider}&id=${user.id}`,
      );
    }
  }

  @Get('x')
  @UseGuards(XGuard)
  async xAuth(
    @ReqUser() result: any,
    @Res() res: Response,
    @Query() _query: SsoSignInQueryDto,
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
    const { redirect, failedRedirect } = JSON.parse(
      decodeURIComponent(req.query.state),
    ) as SsoSignInQueryDto;
    try {
      const { origin } = new URL(redirect);
      const { refreshToken } = await this.authService.signIn(user);
      return res.redirect(
        `${origin}/login/success?refresh=${refreshToken}&redirect=${encodeURIComponent(redirect)}`,
      );
    } catch (error) {
      const { origin } = new URL(failedRedirect);
      const requiredSignUp = error instanceof NotFoundError;
      return res.redirect(
        `${origin}/login/fail?requiredSignUp=${requiredSignUp}&redirect=${encodeURIComponent(failedRedirect)}&provider=${user.provider}&id=${user.id}`,
      );
    }
  }

  @Post('sign-up')
  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse({ type: BasicJWTResponseDto })
  async signUp(@Body() body: SsoSignUpBodyDto) {
    return this.authService.signUp(body);
  }

  @UseGuards(AuthRefreshGuard)
  @ApiSecurity(AuthType.REFRESH)
  @Post('refresh')
  @ApiOperation({ summary: 'JWT 토큰 재발급' })
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
  @ApiOperation({ summary: '로그아웃' })
  async signOut(@Headers() headers: IncomingHttpHeaders) {
    await this.authService.signOut(headers.authorization.split(' ')[1]);
    return;
  }

  @Post('email/code')
  @ApiOperation({
    summary: '이메일 인증 메일 전송',
  })
  async sendEmailVerificationCode(@Body() body: PostEmailCodeBodyDto) {
    await this.authService.sendEmailVerificationCode(body.email);
    return;
  }

  @Post('email/code/validation')
  @ApiOperation({
    summary: '이메일 인증 코드 검증',
  })
  async validationEmailVerificationCode(
    @Body() body: PostEmailCodeValidationBodyDto,
  ) {
    await this.authService.validationEmailVerificationCode(
      body.email,
      body.emailCode,
    );
    return;
  }
}
