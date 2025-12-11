import { ApiProperty } from '@nestjs/swagger';
import { Portfolio } from '../entity/portfolio.entity';
import {
  ArrayMaxSize,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { UUID } from '@common/type';
import { PortfolioCategory } from '../type/portfolio.type';
import { CursorPaginationDto, PaginationDto } from '@common/dto';
import { CursorPaginationResponseDto } from '@common/repository/repository.dto';
import { ResourceDto } from '@common/dto/resource.dto';
import { IsOptionalDefined } from '@common/decorator/dto.decorator';
import { UserResponseDto } from 'src/module/user/dto/user.dto';

export class PortfolioParamDto {
  @ApiProperty({
    description: 'portfolio 고유 아이디',
    example: 'id',
  })
  @IsUUID()
  portfolioId?: UUID;
}

export class GetPortfoliosQueryDto extends PaginationDto {
  @ApiProperty({
    description: 'portfolio 카테고리',
    example: PortfolioCategory.WRITING,
    required: false,
    enum: PortfolioCategory,
  })
  @IsOptional()
  @IsEnum(PortfolioCategory)
  category?: PortfolioCategory;
}

export class GetUserPortfoliosQueryDto extends CursorPaginationDto {
  @ApiProperty({
    description: 'portfolio 카테고리',
    example: PortfolioCategory.WRITING,
    required: false,
    enum: PortfolioCategory,
  })
  @IsOptional()
  @IsEnum(PortfolioCategory)
  category?: PortfolioCategory;
}

export class PortfolioResponseDto {
  @ApiProperty({
    description: '고유 아이디',
    example: 'id',
  })
  id: UUID;

  @ApiProperty({
    description: 'portfolio 카테고리',
    example: PortfolioCategory.WRITING,
    enum: PortfolioCategory,
  })
  category: PortfolioCategory;

  @ApiProperty({
    description: 'portfolio 썸네일 이미지 경로',
    example: 'https://meenit.com/image.jpg',
    required: false,
  })
  thumbnailUrl?: string;

  @ApiProperty({
    description: '조회수',
    example: 2000,
  })
  viewCount: number;

  @ApiProperty({
    description: '좋아요 수',
    example: 2000,
  })
  likeCount: number;

  @ApiProperty({
    description: '좋아요 여부',
    example: true,
  })
  like: boolean;

  @ApiProperty({
    description: '유저 정보',
    type: UserResponseDto,
  })
  user: UserResponseDto;

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

  constructor(portfolio: Portfolio) {
    this.id = portfolio.id;
    this.category = portfolio.category;
    this.thumbnailUrl = portfolio.thumbnailUrl;
    this.likeCount = portfolio.likeCount;
    this.viewCount = portfolio.viewCount;
    this.like = !!portfolio.likes?.length;
    this.user = new UserResponseDto(portfolio.user);
    this.createdAt = portfolio.createdAt;
    this.updatedAt = portfolio.updatedAt;
  }
}

export class GetPortfoliosResponseDto extends CursorPaginationResponseDto<PortfolioResponseDto> {
  @ApiProperty({
    description: '리스트',
    type: [PortfolioResponseDto],
  })
  list: PortfolioResponseDto[];

  constructor({
    list,
    nextCursor: nextCoursor,
  }: CursorPaginationResponseDto<Portfolio>) {
    super();
    this.list = list.map((portfolio) => new PortfolioResponseDto(portfolio));
    this.nextCursor = nextCoursor;
  }
}

export class GetPortfolioResponseDto {
  @ApiProperty({
    description: '고유 아이디',
    example: 'id',
  })
  id: UUID;

  @ApiProperty({
    description: 'portfolio 카테고리',
    example: PortfolioCategory.WRITING,
    enum: PortfolioCategory,
  })
  category: PortfolioCategory;

  @ApiProperty({
    description: 'portfolio 설명',
    example: 'portfolio 설명',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'portfolio 원본 파일 정보',
    type: ResourceDto,
  })
  resource: ResourceDto;

  @ApiProperty({
    description: 'portfolio 썸네일 이미지 경로',
    example: 'https://meenit.com/image.jpg',
    required: false,
  })
  thumbnailUrl?: string;

  @ApiProperty({
    description: '조회수',
    example: 2000,
  })
  viewCount: number;

  @ApiProperty({
    description: '좋아요 수',
    example: 2000,
  })
  likeCount: number;

  @ApiProperty({
    description: '태그 명',
    example: ['tag1', 'tag2'],
  })
  tags: string[];

  @ApiProperty({
    description: '좋아요 여부',
    example: true,
  })
  like: boolean;

  @ApiProperty({
    description: '유저 정보',
    type: UserResponseDto,
  })
  user: UserResponseDto;

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

  constructor(portfolio: Portfolio) {
    this.id = portfolio.id;
    this.category = portfolio.category;
    this.description = portfolio.description;
    this.resource = new ResourceDto(portfolio.resource);
    this.thumbnailUrl = portfolio.thumbnailUrl;
    this.viewCount = portfolio.viewCount;
    this.likeCount = portfolio.likeCount;
    this.tags = portfolio.tags.map((tag) => tag.tag.name);
    this.like = !!portfolio.likes?.length;
    this.user = new UserResponseDto(portfolio.user);
    this.createdAt = portfolio.createdAt;
    this.updatedAt = portfolio.updatedAt;
  }
}

export class PostPortfoliosBodyDto {
  @ApiProperty({
    description: 'portfolio 카테고리',
    example: PortfolioCategory.WRITING,
    enum: PortfolioCategory,
  })
  @IsEnum(PortfolioCategory)
  category: PortfolioCategory;

  @ApiProperty({
    description: 'portfolio 설명',
    example: 'portfolio 설명',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'portfolio 원본 파일 경로',
    example: 'https://meenit.com/image.jpg',
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'portfolio 썸네일 이미지 경로',
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

export class PatchPortfoliosBodyDto {
  @ApiProperty({
    description: 'portfolio 카테고리',
    example: PortfolioCategory.WRITING,
    required: false,
    enum: PortfolioCategory,
  })
  @IsEnum(PortfolioCategory)
  @IsOptionalDefined()
  category?: PortfolioCategory;

  @ApiProperty({
    description: 'portfolio 설명',
    example: 'portfolio 설명',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Tag 명',
    example: ['Tag1', 'Tag2'],
    type: [String],
    required: false,
  })
  @IsString({ each: true })
  @ArrayMaxSize(5)
  @IsOptional()
  tags?: string[];
}
