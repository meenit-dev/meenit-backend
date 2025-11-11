import { ReqUser } from '@common/decorator';
import {
  BasicJWTResponseDto,
  SignUpRequestDto,
  SsoSignUpQueryDto,
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
  async googleAuth(@Query() _query: SsoSignUpQueryDto) {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  googleCallback(@Req() req, @ReqUser() user: SsoUserPayload) {
    const { name } = JSON.parse(decodeURIComponent(req.query.state));
    return this.authService.signIn(user, name);
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
  @ApiCreatedResponse({
    type: BasicJWTResponseDto,
  })
  xCallback(@Req() req, @ReqUser() user: SsoUserPayload) {
    const { name } = JSON.parse(decodeURIComponent(req.query.state));
    return this.authService.signIn(user, name);
  }

  @Post('sign-up')
  @ApiOperation({
    summary: '회원가입',
  })
  async signUp(@Body() signUpRequest: SignUpRequestDto) {
    await this.authService.signUp(signUpRequest);
    return;
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
