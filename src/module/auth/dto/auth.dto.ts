import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SsoSignUpQueryDto {
  @ApiProperty({
    description: '회원가입 시 유저 이름',
    example: '홍길동',
    required: false,
  })
  @IsOptional()
  name?: string;
}

export interface SignUpRequestDto {
  name: string;
  email: string;
  avatar?: string;
  googleId?: string;
  xId?: string;
}

export class LoginUserDto {
  @ApiProperty({
    description: '유저 고유 아이디',
    example: 'userId',
  })
  id: string;

  @ApiProperty({
    description: '유저 이름',
    example: '홍길동',
  })
  name: string;

  @ApiProperty({
    description: '유저 이메일',
    example: 'aiv@aiv.ai',
  })
  email: string;

  @ApiProperty({
    description: '유저 아바타 이미지 url',
    example: 'https://rs.aiv.ai/users/{userId}/profile/avatar.jpg',
    nullable: true,
  })
  avatar: string | null;
}

export class BasicJWTResponseDto {
  @ApiProperty({
    description: '로그인한 유저 정보',
    type: LoginUserDto,
  })
  user: LoginUserDto;

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

export interface CreateUserAuthTokenDto {
  userId: string;
  accessToken: string;
  refreshToken: string;
}
