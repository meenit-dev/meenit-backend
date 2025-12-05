import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { User } from '../entity/user.entity';
import { UserType } from '../type/user.type';
import { Account } from '../entity/account.entity';
import { IsHandle } from '@common/decorator';
import { IsOptionalDefined, ToBoolean } from '@common/decorator/dto.decorator';
import { SlotStatus } from 'src/module/commission/type/commission.type';
import { Type } from 'class-transformer';
import { PaginationDto } from '@common/dto';
import { PaginationResponseDto } from '@common/repository/repository.dto';

export class UserResponseDto {
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

  @ApiProperty({
    description: '생성 날짜',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 날짜',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.handle = user.handle;
    this.avatar = user.avatar;
    this.type = user.type;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

export class GetMyUserProfileResponseDto extends UserResponseDto {
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

  @ApiProperty({
    description: '프로필에 등록한 소개 link',
    example: ['https://youtube.com'],
    nullable: true,
  })
  links: string[] | null;

  @ApiProperty({
    description: '내가 팔로우한 여부',
    example: true,
  })
  follow: boolean;

  @ApiProperty({
    description: '나에게 팔로우 한 유저 수',
    example: 10,
  })
  followerCount: number;

  @ApiProperty({
    description: '내가 팔로우 한 유저 수',
    example: 10,
  })
  followingCount: number;

  constructor(user: User) {
    super(user);
    this.introduction = user.profile.introduction;
    this.background = user.profile.background;
    this.links = user.profile.links;
    this.follow = !!user.follow;
    this.followerCount = user.followerCount;
    this.followingCount = user.followingCount;
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
  @IsOptional()
  @IsHandle()
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

  @ApiProperty({
    description: '프로필에 등록할 소개 link',
    example: ['https://youtube.com'],
    required: false,
  })
  @IsString({ each: true })
  @IsOptional()
  links?: string[];
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

class CreatorSlotSetting {
  @ApiProperty({
    description: '월별 split 수',
    example: 1,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(3)
  @IsOptionalDefined()
  monthSplitCount?: number;

  @ApiProperty({
    description: '월별 생성시 기본 상태 값',
    example: SlotStatus.UNSET,
    required: false,
  })
  @IsEnum(SlotStatus)
  @IsOptionalDefined()
  defaultStatus?: SlotStatus;
}

export class GetCreatorSettingResponseDto {
  @ApiProperty({
    description: 'slot 설정 정보',
    type: CreatorSlotSetting,
  })
  slot: CreatorSlotSetting;

  constructor(user: User) {
    this.slot = {
      monthSplitCount: user.creatorSetting.slotMonthSplitCount,
      defaultStatus: user.creatorSetting.slotDefaultStatus,
    };
  }
}

export class PatchCreatorSettingBodyDto {
  @ApiProperty({
    description: 'slot 설정 정보',
    type: CreatorSlotSetting,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatorSlotSetting)
  slot?: CreatorSlotSetting;
}

export class GetFollowUserQueryDto extends PaginationDto {
  @ApiProperty({
    description: 'true: following 유저 조회. false: follower 유저 조회',
    type: Boolean,
    example: true,
  })
  @ToBoolean()
  isFollowing: boolean;
}

export class GetFollowUserResponseDto extends PaginationResponseDto<GetMyUserProfileResponseDto> {
  @ApiProperty({
    description: '리스트',
    type: [GetMyUserProfileResponseDto],
  })
  list: GetMyUserProfileResponseDto[];

  constructor({ list, totalCount }: PaginationResponseDto<User>) {
    super();
    this.list = list.map((user) => new GetMyUserProfileResponseDto(user));
    this.totalCount = totalCount;
  }
}
