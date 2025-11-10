import { ReqUser } from '@common/decorator';
import {
  BasicJWTResponseDto,
  SignInRequest,
  SignUpRequestDto,
} from '../dto/auth.dto';
import { AuthService } from '../service/auth.service';
import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthType, UserPayload } from '../type/auth.type';
import { AuthUserGuard } from '../guard/auth.user.guard';
import { AuthRefreshGuard } from '../guard/auth.refresh.guard';
import { GetMyUserResponseDto } from 'src/module/user/dto/user.dto';
import { IncomingHttpHeaders } from 'http';
import { GoogleOAuthGuard } from '../guard/google-oauth.guard';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@ReqUser() user: UserPayload) {
    console.log(user);
    return;
  }

  @UseGuards(AuthUserGuard)
  @ApiSecurity(AuthType.USER)
  @Get('me')
  @ApiOperation({
    summary: 'user 정보 확인',
  })
  @ApiOkResponse({
    type: GetMyUserResponseDto,
  })
  async me(@ReqUser() user: UserPayload) {
    return new GetMyUserResponseDto(await this.authService.me(user));
  }

  @Post('sign-up')
  @ApiOperation({
    summary: '회원가입',
  })
  async signUp(@Body() signUpRequest: SignUpRequestDto) {
    await this.authService.signUp(signUpRequest);
    return;
  }

  @Post('sign-in')
  @ApiOperation({
    summary: '로그인',
  })
  @ApiCreatedResponse({
    type: BasicJWTResponseDto,
  })
  async signIn(
    @Body() signInRequest: SignInRequest,
  ): Promise<BasicJWTResponseDto> {
    return this.authService.signIn(signInRequest);
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
