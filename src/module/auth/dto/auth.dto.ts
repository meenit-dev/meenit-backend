import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserResponseDto } from 'src/module/user/dto/user.dto';
import { SsoProvider } from '../type/auth.type';

export class SsoSignInQueryDto {
  @ApiProperty({
    description: '로그인 성공 시 리다이렉트 할 url',
    example: 'https://meenit.com',
  })
  @IsString()
  redirect: string;

  @ApiProperty({
    description: '로그인 실패 시 리다이렉트 할 url',
    example: 'https://meenit.com',
  })
  @IsString()
  failedRedirect: string;
}

export class SsoSignUpBodyDto {
  @ApiProperty({
    description: 'SSO 로그인 Provider',
    example: SsoProvider.GOOGLE,
  })
  @IsEnum(SsoProvider)
  provider: SsoProvider;

  @ApiProperty({
    description: 'SSO 로그인 고유 아이디',
    example: '1234567',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: '회원가입 시 유저 이름',
    example: '홍길동',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '회원가입 시 유저 이메일',
    example: 'hong@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '회원가입 발급받은 이메일 인증 코드',
    example: '123456',
  })
  @IsString()
  code: string;
}

export interface SignUpRequestDto {
  name: string;
  email: string;
  avatar?: string;
  googleId?: string;
  xId?: string;
}

export class BasicJWTResponseDto {
  @ApiProperty({
    description: 'accessToken',
    example: 'accessToken',
  })
  accessToken: string;

  @ApiProperty({
    description: 'refreshToken',
    example: 'refreshToken',
  })
  refreshToken: string;
}

export class BasicJWTWithUserResponseDto extends BasicJWTResponseDto {
  @ApiProperty({
    description: '로그인한 유저 정보',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}

export class PostEmailCodeBodyDto {
  @ApiProperty({
    description: '회원가입 시 유저 이메일',
    example: 'hong@email.com',
  })
  @IsEmail()
  email: string;
}

export class PostEmailCodeValidationBodyDto {
  @ApiProperty({
    description: '회원가입 시 유저 이메일',
    example: 'hong@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '회원가입 발급받은 이메일 인증 코드',
    example: '123456',
  })
  @IsString()
  emailCode: string;
}

export interface CreateUserAuthTokenDto {
  userId: string;
  accessToken: string;
  refreshToken: string;
}
