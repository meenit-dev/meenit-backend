import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';
import { FaqCategory } from '../type/faq.type';
import { Faq } from '../entity/faq.entity';
import { UUID } from '@common/type';

export class FaqParamDto {
  @ApiProperty({
    description: '고유 아이디',
    example: 'id',
  })
  @IsUUID()
  faqId?: UUID;
}

export class PostFaqBodyDto {
  @ApiProperty({
    description: 'FAQ 제목',
    example: 'FAQ 제목',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'FAQ 내용',
    example: 'FAQ 내용. 아마 html',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: '같은 카테고리 내의 FAQ 순서',
    example: 1,
  })
  @IsNumber()
  order: number;

  @ApiProperty({
    description: 'FAQ 타입',
    example: FaqCategory.ACCOUNT,
    enum: FaqCategory,
  })
  @IsEnum(FaqCategory)
  category: FaqCategory;
}

export class PutFaqBodyDto {
  @ApiProperty({
    description: 'FAQ 제목',
    example: 'FAQ 제목',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'FAQ 내용',
    example: 'FAQ 내용. 아마 html',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: '같은 카테고리 내의 FAQ 순서',
    example: 1,
  })
  @IsNumber()
  order: number;

  @ApiProperty({
    description: 'FAQ 타입',
    example: FaqCategory.ACCOUNT,
    enum: FaqCategory,
  })
  @IsEnum(FaqCategory)
  category: FaqCategory;
}

export class FaqResponseDto {
  @ApiProperty({
    description: '고유 아이디',
    example: 'id',
  })
  id: UUID;

  @ApiProperty({
    description: 'FAQ 제목',
    example: 'FAQ 제목',
  })
  title: string;

  @ApiProperty({
    description: 'FAQ 내용',
    example: 'FAQ 내용. 아마 html',
  })
  content: string;

  @ApiProperty({
    description: 'FAQ 상단 고정 여부',
    example: false,
  })
  pin: boolean;

  @ApiProperty({
    description: '같은 카테고리 내의 FAQ 순서',
    example: 1,
  })
  @IsNumber()
  order: number;

  @ApiProperty({
    description: 'FAQ 타입',
    example: FaqCategory.ACCOUNT,
    enum: FaqCategory,
  })
  @IsEnum(FaqCategory)
  category: FaqCategory;

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

export class FaqListResponseDto {
  @ApiProperty({
    description: '고유 아이디',
    example: 'id',
  })
  id: UUID;

  @ApiProperty({
    description: 'FAQ 제목',
    example: 'FAQ 제목',
  })
  title: string;

  @ApiProperty({
    description: '같은 카테고리 내의 FAQ 순서',
    example: 1,
  })
  @IsNumber()
  order: number;

  @ApiProperty({
    description: 'FAQ 타입',
    example: FaqCategory.ACCOUNT,
    enum: FaqCategory,
  })
  @IsEnum(FaqCategory)
  category: FaqCategory;

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

  constructor(faq: Faq) {
    this.id = faq.id;
    this.title = faq.title;
    this.order = faq.order;
    this.category = faq.category;
    this.createdAt = faq.createdAt;
    this.updatedAt = faq.updatedAt;
  }
}

export class GetFaqsResponseDto {
  @ApiProperty({
    description: '리스트',
    type: [FaqListResponseDto],
  })
  list: FaqListResponseDto[];

  constructor(faqs: Faq[]) {
    this.list = faqs.map((faq) => new FaqListResponseDto(faq));
  }
}

export class GetFaqsQueryDto {
  @ApiProperty({
    description: 'FAQ 타입',
    example: FaqCategory.ACCOUNT,
    enum: FaqCategory,
  })
  @IsEnum(FaqCategory)
  category: FaqCategory;
}
