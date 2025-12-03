import { ApiProperty } from '@nestjs/swagger';
import { Commission } from '../entity/commission.entity';
import {
  ArrayMaxSize,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { UUID } from '@common/type';
import { CommissionCategory } from '../type/commission.type';
import { PaginationDto } from '@common/dto';
import { PaginationResponseDto } from '@common/repository/repository.dto';
import { UserResponseDto } from 'src/module/user/dto/user.dto';
import { IsOptionalDefined } from '@common/decorator/dto.decorator';

export class CommissionParamDto {
  @ApiProperty({
    description: 'Commission 고유 아이디',
    example: 'id',
  })
  @IsUUID()
  commissionId?: UUID;
}

export class GetCommissionsQueryDto extends PaginationDto {
  @ApiProperty({
    description: 'Commission 카테고리',
    example: CommissionCategory.WRITING,
    required: false,
    enum: CommissionCategory,
  })
  @IsOptional()
  @IsEnum(CommissionCategory)
  category?: CommissionCategory;
}

export class CommissionResponseDto {
  @ApiProperty({
    description: '고유 아이디',
    example: 'id',
  })
  id: UUID;

  @ApiProperty({
    description: 'Commission 카테고리',
    example: CommissionCategory.WRITING,
    enum: CommissionCategory,
  })
  category: CommissionCategory;

  @ApiProperty({
    description: 'Commission 제목',
    example: 'Commission 제목',
  })
  title: string;

  @ApiProperty({
    description: 'Commission 썸네일 이미지 경로',
    example: 'https://meenit.com/image.jpg',
    required: false,
  })
  thumbnailUrl?: string;

  @ApiProperty({
    description: '유저 정보',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    description: '태그 명',
    example: ['tag1', 'tag2'],
  })
  tags: string[];

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
}

export class GetCommissionsResponseDto extends PaginationResponseDto<CommissionResponseDto> {
  @ApiProperty({
    description: '리스트',
    type: [CommissionResponseDto],
  })
  list: CommissionResponseDto[];

  constructor({ list, totalCount }: PaginationResponseDto<Commission>) {
    super();
    this.list = list.map(
      ({
        id,
        category,
        title,
        thumbnailUrl,
        createdAt,
        updatedAt,
        user,
        tags,
      }) => ({
        id,
        category,
        title,
        thumbnailUrl,
        createdAt,
        updatedAt,
        user: new UserResponseDto(user),
        tags: tags.map((tag) => tag.tag.name),
      }),
    );
    this.totalCount = totalCount;
  }
}

export class GetCommissionResponseDto {
  @ApiProperty({
    description: '고유 아이디',
    example: 'id',
  })
  id: UUID;

  @ApiProperty({
    description: 'Commission 카테고리',
    example: CommissionCategory.WRITING,
    enum: CommissionCategory,
  })
  category: CommissionCategory;

  @ApiProperty({
    description: 'Commission 제목',
    example: 'Commission 제목',
  })
  title: string;

  @ApiProperty({
    description: 'Commission 설명',
    example: 'Commission 설명',
  })
  description: string;

  @ApiProperty({
    description: 'Commission 본문',
    example: 'Commission 본문',
  })
  contents: string;

  @ApiProperty({
    description: 'Commission 원본 파일 경로',
    example: 'https://meenit.com/image.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'Commission 썸네일 이미지 경로',
    example: 'https://meenit.com/image.jpg',
    required: false,
  })
  thumbnailUrl?: string;

  @ApiProperty({
    description: '유저 정보',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    description: '태그 명',
    example: ['tag1', 'tag2'],
  })
  tags: string[];

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

  constructor(commission: Commission) {
    this.id = commission.id;
    this.category = commission.category;
    this.title = commission.title;
    this.description = commission.description;
    this.contents = commission.contents;
    this.url = commission.url;
    this.thumbnailUrl = commission.thumbnailUrl;
    this.user = new UserResponseDto(commission.user);
    this.tags = commission.tags.map((tag) => tag.tag.name);
    this.createdAt = commission.createdAt;
    this.updatedAt = commission.updatedAt;
  }
}

export class PostCommissionBodyDto {
  @ApiProperty({
    description: 'Commission 카테고리',
    example: CommissionCategory.WRITING,
    enum: CommissionCategory,
  })
  @IsEnum(CommissionCategory)
  category: CommissionCategory;

  @ApiProperty({
    description: 'Commission 제목',
    example: 'Commission 제목',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Commission 설명',
    example: 'Commission 설명',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Commission 본문',
    example: 'Commission 본문',
  })
  @IsString()
  contents: string;

  @ApiProperty({
    description: 'Commission 이미지 경로',
    example: 'https://meenit.com/image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: 'Commission 썸네일 이미지 경로',
    example: 'https://meenit.com/image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'Tag 명',
    example: ['Tag1', 'Tag2'],
    type: [String],
  })
  @IsString({ each: true })
  @ArrayMaxSize(5)
  tags: string[];
}

export class PatchCommissionBodyDto {
  @ApiProperty({
    description: 'Commission 카테고리',
    example: CommissionCategory.WRITING,
    required: false,
    enum: CommissionCategory,
  })
  @IsEnum(CommissionCategory)
  @IsOptionalDefined()
  category?: CommissionCategory;

  @ApiProperty({
    description: 'Commission 제목',
    example: 'Commission 제목',
    required: false,
  })
  @IsString()
  @IsOptionalDefined()
  title?: string;

  @ApiProperty({
    description: 'Commission 설명',
    example: 'Commission 설명',
    required: false,
  })
  @IsString()
  @IsOptionalDefined()
  description?: string;

  @ApiProperty({
    description: 'Commission 본문',
    example: 'Commission 본문',
    required: false,
  })
  @IsString()
  @IsOptionalDefined()
  contents?: string;

  @ApiProperty({
    description: 'Commission 이미지 경로',
    example: 'https://meenit.com/image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: 'Commission 썸네일 이미지 경로',
    example: 'https://meenit.com/image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'Tag 명',
    example: ['Tag1', 'Tag2'],
    type: [String],
    required: false,
  })
  @IsString({ each: true })
  @ArrayMaxSize(5)
  @IsOptionalDefined()
  tags?: string[];
}
