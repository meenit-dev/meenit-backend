import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { InquiryCategory } from '../type/inquiry.type';
import { Inquiry } from '../entity/inquiry.entity';
import { UUID } from '@common/type';
import { PaginationDto } from '@common/dto';
import { PaginationResponseDto } from '@common/repository/repository.dto';

export class InquiryParamDto {
  @ApiProperty({
    description: '고유 아이디',
    example: 'id',
  })
  @IsUUID()
  inquiryId: UUID;
}

export class PostInquiryBodyDto {
  @ApiProperty({
    description: '문의 제목',
    example: '문의 제목',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '문의 내용',
    example: '문의 내용',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: '문의 타입',
    example: InquiryCategory.ACCOUNT,
    enum: InquiryCategory,
  })
  @IsEnum(InquiryCategory)
  category: InquiryCategory;

  @ApiProperty({
    description: '문의 파일 url. 최대 10개',
    example: ['문의 파일 url. 최대 10개'],
    type: [String],
  })
  @IsString({ each: true })
  @ArrayMaxSize(10)
  @IsOptional()
  resources?: string[];
}

export class InquiryAnswerResponseDto {
  @ApiProperty({
    description: '고유 아이디',
    example: 'id',
  })
  id: UUID;

  @ApiProperty({
    description: '문의 답변 내용',
    example: '문의 답변 내용',
  })
  content: string;

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

export class InquiryResponseDto {
  @ApiProperty({
    description: '고유 아이디',
    example: 'id',
  })
  id: UUID;

  @ApiProperty({
    description: '문의 제목',
    example: '문의 제목',
  })
  title: string;

  @ApiProperty({
    description: '문의 내용',
    example: '문의 내용',
  })
  content: string;

  @ApiProperty({
    description: '문의 타입',
    example: InquiryCategory.ACCOUNT,
    enum: InquiryCategory,
  })
  category: InquiryCategory;

  @ApiProperty({
    description: '문의 답변',
    type: InquiryAnswerResponseDto,
    nullable: true,
  })
  answer?: InquiryAnswerResponseDto;

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

  @ApiProperty({
    description: '답변 날짜',
    example: '2024-01-01T00:00:00.000Z',
    nullable: true,
  })
  answeredAt?: Date;
}

export class InquiryListResponseDto {
  @ApiProperty({
    description: '고유 아이디',
    example: 'id',
  })
  id: UUID;

  @ApiProperty({
    description: '문의 제목',
    example: '문의 제목',
  })
  title: string;

  @ApiProperty({
    description: '문의 타입',
    example: InquiryCategory.ACCOUNT,
    enum: InquiryCategory,
  })
  @IsEnum(InquiryCategory)
  category: InquiryCategory;

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

  @ApiProperty({
    description: '답변 날짜',
    example: '2024-01-01T00:00:00.000Z',
    nullable: true,
  })
  answeredAt?: Date;

  constructor(inquiry: Inquiry) {
    this.id = inquiry.id;
    this.title = inquiry.title;
    this.category = inquiry.category;
    this.createdAt = inquiry.createdAt;
    this.updatedAt = inquiry.updatedAt;
    this.answeredAt = inquiry.answeredAt;
  }
}

export class GetInquiriesResponseDto extends PaginationResponseDto<InquiryListResponseDto> {
  @ApiProperty({
    description: '리스트',
    type: [InquiryListResponseDto],
  })
  list: InquiryListResponseDto[];

  constructor({ list, totalCount }: { list: Inquiry[]; totalCount: number }) {
    super();
    this.list = list.map((inquiry) => new InquiryListResponseDto(inquiry));
    this.totalCount = totalCount;
  }
}

export class GetInquiriesQueryDto extends PaginationDto {
  @ApiProperty({
    description: '문의 타입',
    example: InquiryCategory.ACCOUNT,
    enum: InquiryCategory,
    required: false,
  })
  @IsOptional()
  @IsEnum(InquiryCategory)
  category?: InquiryCategory;
}
