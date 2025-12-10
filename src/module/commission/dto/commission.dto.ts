import { ApiProperty } from '@nestjs/swagger';
import { Commission } from '../entity/commission.entity';
import {
  ArrayMaxSize,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { UUID } from '@common/type';
import {
  CommissionCategory,
  CommissionOptionType,
} from '../type/commission.type';
import { PaginationDto } from '@common/dto';
import { PaginationResponseDto } from '@common/repository/repository.dto';
import { UserResponseDto } from 'src/module/user/dto/user.dto';
import { IsOptionalDefined } from '@common/decorator/dto.decorator';
import { Type } from 'class-transformer';

export class CommissionParamDto {
  @ApiProperty({
    description: 'Commission 고유 아이디',
    example: 'id',
  })
  @IsUUID()
  commissionId?: UUID;
}

export class CommissionOptionChoiceDto {
  @ApiProperty({
    example: '옵션 선택지 이름. 최대 100자',
    description: '옵션 선택지 이름. 최대 100자',
  })
  @IsString()
  @MaxLength(100)
  label: string;
}

export class CommissionOptionDto {
  @ApiProperty({
    example: '옵션 이름. 최대 50자.',
    description: '옵션 이름. 최대 50자',
  })
  @IsString()
  @MaxLength(50)
  title: string;

  @ApiProperty({
    example: '옵션 설명. 최대 100자',
    description: '옵션 설명. 최대 100자',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  description?: string;

  @ApiProperty({
    example: true,
    description: '필수 옵션 여부',
  })
  @IsBoolean()
  required: boolean;

  @ApiProperty({
    enum: CommissionOptionType,
    example: CommissionOptionType.RADIO,
    description: '옵션 타입',
  })
  @IsEnum(CommissionOptionType)
  type: CommissionOptionType;

  @ApiProperty({
    type: [CommissionOptionChoiceDto],
    description: '옵션 선택지 리스트. 최대 10개. text 제외하곤 필수',
  })
  @ValidateNested({ each: true })
  @Type(() => CommissionOptionChoiceDto)
  @ArrayMaxSize(10)
  choices?: CommissionOptionChoiceDto[];
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
    description: 'Commission 이미지 경로 리스트. 최대 5개',
    example: ['https://meenit.com/image.jpg'],
    required: false,
  })
  thumbnails?: string[];

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
        thumbnails,
        createdAt,
        updatedAt,
        user,
        tags,
      }) => ({
        id,
        category,
        title,
        thumbnails: thumbnails?.map((thumbnail) =>
          thumbnail.resource.makeUrl(),
        ),
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
    description: 'Commission 이미지 경로 리스트. 최대 5개',
    example: ['https://meenit.com/image.jpg'],
    required: false,
  })
  thumbnails?: string[];

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
    type: [CommissionOptionDto],
    description: '커미션 옵션 목록',
  })
  options: CommissionOptionDto[];

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
    this.thumbnails = commission.thumbnails?.map((thumbnail) =>
      thumbnail.resource.makeUrl(),
    );
    this.user = new UserResponseDto(commission.user);
    this.tags = commission.tags.map((tag) => tag.tag.name);
    this.options = commission.options?.map((option) => ({
      title: option.title,
      description: option.description,
      required: option.required,
      type: option.type,
      choices: option.choices.map(({ label }) => ({ label })),
    }));
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
    description: 'Commission 이미지 경로 리스트. 최대 5개',
    example: ['https://meenit.com/image.jpg'],
    required: false,
  })
  @IsString({ each: true })
  @ArrayMaxSize(5)
  @IsOptional()
  thumbnails?: string[];

  @ApiProperty({
    description: 'Tag 명',
    example: ['Tag1', 'Tag2'],
    type: [String],
  })
  @IsString({ each: true })
  @ArrayMaxSize(5)
  tags: string[];

  @ApiProperty({
    type: [CommissionOptionDto],
    description: '커미션 옵션 목록. 최대 20개',
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CommissionOptionDto)
  @ArrayMaxSize(20)
  options?: CommissionOptionDto[];
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
    description: 'Commission 이미지 경로 리스트. 최대 5개',
    example: ['https://meenit.com/image.jpg'],
    required: false,
  })
  @IsString({ each: true })
  @ArrayMaxSize(5)
  @IsOptional()
  thumbnails?: string[];

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

  @ApiProperty({
    type: [CommissionOptionDto],
    description: '커미션 옵션 목록. 최대 20개',
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CommissionOptionDto)
  @ArrayMaxSize(20)
  options?: CommissionOptionDto[];
}
