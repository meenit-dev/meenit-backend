import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { GetMyUserResponseDto } from 'src/module/user/dto/user.dto';

export class SsoSignUpQueryDto {
  @ApiProperty({
    description: '회원가입 시 유저 이름',
    example: '홍길동',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: '회원가입 시 유저 이메일',
    example: 'hong@email.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: '회원가입 발급받은 이메일 인증 코드',
    example: '123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  emailCode?: string;

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

export interface SignUpRequestDto {
  name: string;
  email: string;
  avatar?: string;
  googleId?: string;
  xId?: string;
}

export class BasicJWTResponseDto {
  @ApiProperty({
    description: '로그인한 유저 정보',
    type: GetMyUserResponseDto,
  })
  user: GetMyUserResponseDto;

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
