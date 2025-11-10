import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpRequestDto {
  @ApiProperty({
    description: '유저 이름',
    example: '홍길동',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '계정 email',
    example: 'aiv@aiv.ai',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '계정 password. 최소 8글자',
    example: 'password',
  })
  @IsString()
  @MinLength(8)
  password: string;
}

export class SignInRequest {
  @ApiProperty({
    description: '계정 email',
    example: 'aiv@aiv.ai',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '계정 password',
    example: 'password',
  })
  @IsString()
  password: string;
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
