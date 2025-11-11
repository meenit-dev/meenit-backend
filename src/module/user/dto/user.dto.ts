import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { User } from '../entity/user.entity';

export class GetMyUserResponseDto {
  @ApiProperty({
    description: 'user 이름',
    example: '홍길동',
  })
  name: string;

  @ApiProperty({
    description: 'user 이메일',
    example: 'aiv@aiv.ai',
  })
  email: string;

  @ApiProperty({
    description: '유저 avatar url',
    example: 'https://rs.aiv.ai/users/{userId}/profile/avatar.jpg',
    nullable: true,
  })
  avatar: string | null;

  constructor(user: User) {
    this.name = user.name;
    this.email = user.email;
    this.avatar = user.avatar;
  }
}

export class PutUserPasswordBodyDto {
  @ApiProperty({
    description: '현재 사용중인 비밀번호',
    example: 'currentPassword',
  })
  @IsString()
  @MinLength(8)
  currentPassword: string;

  @ApiProperty({
    description: '변경할 비밀번호',
    example: 'updatePassword',
  })
  @IsString()
  @MinLength(8)
  updatePassword: string;
}

export class PutUserInfoBodyDto {
  @ApiProperty({
    description: '유저 이름',
    example: '홍길동',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: '유저 avatar url',
    example: 'https://rs.aiv.ai/users/{userId}/profile/avatar.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;
}
