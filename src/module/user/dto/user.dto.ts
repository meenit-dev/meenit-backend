import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { User } from '../entity/user.entity';
import { UserType } from '../type/user.type';
import { Account } from '../entity/account.entity';

export class UserHandleParamDto {
  @ApiProperty({
    description: 'user 고유 인식 값',
    example: 'Hong1',
  })
  @IsString()
  handle: string;
}

export class GetMyUserResponseDto {
  @ApiProperty({
    description: '유저 고유 아이디',
    example: 'userId',
  })
  id: string;

  @ApiProperty({
    description: 'user 이름',
    example: '홍길동',
  })
  name: string;

  @ApiProperty({
    description: 'user 고유 인식 값',
    example: 'Hong1',
  })
  handle: string;

  @ApiProperty({
    description: '유저 avatar url',
    example: 'https://meenit.com/users/{userId}/profile/avatar.jpg',
    nullable: true,
  })
  avatar: string | null;

  @ApiProperty({
    description: '유저 타입',
    example: UserType.CREATOR,
    enum: UserType,
  })
  type: UserType;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.handle = user.handle;
    this.avatar = user.avatar;
    this.type = user.type;
  }
}

export class GetMyUserProfileResponseDto extends GetMyUserResponseDto {
  @ApiProperty({
    description: '자기 소개',
    example: '자기 소개',
    nullable: true,
  })
  introduction: string | null;

  @ApiProperty({
    description: '프로필 배경 이미지 경로',
    example: 'https://meenit.com/users/{userId}/profile/avatar.jpg',
    nullable: true,
  })
  background: string | null;

  constructor(user: User) {
    super(user);
    this.introduction = user.profile.introduction;
    this.background = user.profile.background;
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

export class PatchUserInfoBodyDto {
  @ApiProperty({
    description: '유저 이름',
    example: '홍길동',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(15)
  @MinLength(1)
  name?: string;

  @ApiProperty({
    description: 'user 고유 인식 값',
    example: 'Hong1',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(15)
  @MinLength(5)
  handle?: string;

  @ApiProperty({
    description: '자기 소개',
    example: '자기 소개',
    required: false,
  })
  @IsString()
  @IsOptional()
  introduction?: string;

  @ApiProperty({
    description: '프로필 배경 이미지 경로',
    example: 'https://meenit.com/users/{userId}/profile/avatar.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  background?: string;

  @ApiProperty({
    description: '유저 avatar url',
    example: 'https://rs.aiv.ai/users/{userId}/profile/avatar.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;
}

export class PutUserPhoneBodyDto {
  @ApiProperty({
    description: '전화번호',
    example: '01012345678',
    required: false,
  })
  @IsString()
  phone: string;
}

export class GetUserAccountResponseDto {
  @ApiProperty({
    description: '실명',
    example: '홍길동',
  })
  name: string;

  @ApiProperty({
    description: '은행 코드',
    example: '01012345678',
  })
  code: string;

  @ApiProperty({
    description: '계좌번호',
    example: '01012345678',
  })
  number: string;

  constructor(account: Account) {
    this.name = account.name;
    this.code = account.code;
    this.number = account.number;
  }
}

export class PutUserAccountBodyDto {
  @ApiProperty({
    description: '실명',
    example: '홍길동',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '은행 코드',
    example: '01012345678',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: '계좌번호',
    example: '01012345678',
  })
  @IsString()
  number: string;
}
