import { Language, Order } from '@common/type';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../type/user.type';
import { RolesGroupCategory } from 'src/module/role/type/role.type';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { User } from '../entity/user.entity';
import { GroupUser } from '../entity/group.user.view.entity';
import { PaginationDto } from '@common/dto';
import { PaginationResponseDto } from '@common/repository/repository.dto';
import { generateHashedColor } from '@common/util';

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
    description: '유저가 설정한 언어',
    enum: Language,
    example: Language.KO,
  })
  language: Language;

  @ApiProperty({
    description: '유저가 설정한 TimeZone 분',
    example: 540,
  })
  timeZone: number;

  @ApiProperty({
    description: '유저 avatar url',
    example: 'https://rs.aiv.ai/users/{userId}/profile/avatar.jpg',
    nullable: true,
  })
  avatar: string | null;

  constructor(user: UserDto) {
    this.name = user.name;
    this.email = user.email;
    this.language = user.language;
    this.timeZone = user.timeZone;
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
    description: '유저가 설정한 언어',
    enum: Language,
    example: Language.KO,
    required: false,
  })
  @IsEnum(Language)
  @IsOptional()
  language?: Language;

  @ApiProperty({
    description: '유저가 설정한 TimeZone 분',
    example: 540,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  timeZone?: number;

  @ApiProperty({
    description: '유저 avatar url',
    example: 'https://rs.aiv.ai/users/{userId}/profile/avatar.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;
}

export class GetUserProfilesBatchQueryDto {
  @ApiProperty({
    description: '유저 아이디 리스트',
    example: 'id1,id2',
  })
  @IsUUID(null, { each: true })
  @Transform(({ value }) =>
    (Array.isArray(value) ? value : value.split(',')).map((v: string) =>
      v.trim(),
    ),
  )
  ids: string[];

  @ApiProperty({
    description: '삭제된 데이터 조회 여부',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform((value) => {
    return value.value == 'true' ? true : false;
  })
  isDeleted?: boolean;
}

class UserProfile {
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

  @ApiProperty({
    description: '가입 날짜',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '삭제 여부',
    example: false,
  })
  isDeleted: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.isDeleted = !!user.deletedAt;
    this.avatar = this.isDeleted ? null : user.avatar;
  }
}

export class GetUserProfilesBatchResponseDto {
  @ApiProperty({
    description: '유저 프로필 리스트',
    type: [UserProfile],
  })
  list: UserProfile[];

  constructor(users: User[]) {
    this.list = users.map((user) => new UserProfile(user));
  }
}

export class GetUserProfilesResponseDto {
  @ApiProperty({
    description: '유저 프로필 리스트',
    type: [UserProfile],
  })
  list: UserProfile[];

  @ApiProperty({
    description: '데이터 개수',
    example: 120,
  })
  totalCount: number;

  constructor({ list, totalCount }: PaginationResponseDto<User>) {
    this.list = list.map((user) => new UserProfile(user));
    this.totalCount = totalCount;
  }
}

class AssignUserTeamDto {
  @ApiProperty({
    description: 'team 고유 아이디',
    example: 'teamId',
  })
  id: string;

  @ApiProperty({
    description: 'team 이름',
    example: 'Worker Team',
  })
  name: string;

  constructor({ id, name }: AssignUserTeamDto) {
    this.id = id;
    this.name = name;
  }
}

export class UserRoleDto {
  @ApiProperty({
    description: 'role 고유 아이디',
    example: 'roleId',
  })
  id: string;

  @ApiProperty({
    description: 'role 이름',
    example: 'Editor',
  })
  name: string;

  constructor(args: { id: string; name: string }) {
    this.id = args.id;
    this.name = args.name;
  }
}

export class AssignUserRoleDto {
  @ApiProperty({
    description: 'aivauth role 정보',
  })
  AiVAuth: UserRoleDto;

  @ApiProperty({
    description:
      'aivdata role 정보. null이라면 권한을 할당하지 않은 제품이며 undefined라면 활성화되지 않은 제품입니다.',
    required: false,
  })
  AiVData?: UserRoleDto;

  @ApiProperty({
    description:
      'aivops role 정보. null이라면 권한을 할당하지 않은 제품이며 undefined라면 활성화되지 않은 제품입니다.',
    required: false,
  })
  AiVOps?: UserRoleDto;

  constructor(rolesGroupCategory: RolesGroupCategory) {
    Object.entries(rolesGroupCategory).forEach(([category, role]) => {
      this[category] = role ? new UserRoleDto(role) : role;
    });
  }
}

export class GroupUserDto {
  @ApiProperty({
    description: 'user 고유 아이디',
    example: 'userId',
  })
  id: string;

  @ApiProperty({
    description: 'user 이름',
    example: '아이브',
    nullable: true,
  })
  name?: string;

  @ApiProperty({
    description: 'user email',
    example: 'aiv@aiv.ai',
  })
  email: string;

  @ApiProperty({
    description: 'user에게 부여된 role 정보',
    type: AssignUserRoleDto,
  })
  roles: AssignUserRoleDto;

  @ApiProperty({
    description: 'user가 속한 팀 정보 리스트',
    type: [AssignUserTeamDto],
  })
  teams: AssignUserTeamDto[];

  @ApiProperty({
    description: 'user 상태',
    example: UserStatus.ACTIVE,
    enum: UserStatus,
  })
  status: UserStatus;

  @ApiProperty({
    description: 'user personal color',
    example: '#FFFFFF',
  })
  personalColor: string;

  @ApiProperty({
    description: 'user avatar url',
    example: 'https://rs.aiv.ai/users/{userId}/profile/avatar.jpg',
    nullable: true,
  })
  avatar?: string;

  constructor(
    user: GroupUser & {
      rolesGroupCategory: RolesGroupCategory;
    },
  ) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.teams = user.teams?.map((team) => new AssignUserTeamDto(team)) || [];
    this.roles = new AssignUserRoleDto(user.rolesGroupCategory);
    this.status = user.status;
    this.personalColor = generateHashedColor(user.email);
    this.avatar = user.avatar;
  }
}

export class GetGroupUsersQueryDto extends PaginationDto {
  @ApiProperty({
    description: '정렬할 데이터의 key',
    example: 'name',
    enum: ['name', 'email'],
  })
  @IsEnum(['name', 'email'])
  orderKey: string;

  @ApiProperty({
    description: '정렬 순서',
    example: Order.ASC,
  })
  @IsEnum(Order)
  order: Order;

  @ApiProperty({
    description: '검색할 데이터',
    example: '이름',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
}

export interface FindGroupUserCountResultDto {
  teamId: string;
  userCount: number;
}

export interface FindGroupUsersWithInviteDto {
  groupId: string;
  teamIds?: string[];
  search?: string;
  orderKey: string;
  order: Order;
  limit?: number;
  page?: number;
}

export interface FindGroupUsersDto {
  groupId: string;
  search?: string;
  orderKey: string;
  order: Order;
  limit?: number;
  page?: number;
}
