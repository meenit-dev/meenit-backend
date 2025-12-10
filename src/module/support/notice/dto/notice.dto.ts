import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { NoticeCategory } from '../type/notice.type';
import { PaginationResponseDto } from '@common/repository/repository.dto';
import { Notice } from '../entity/notice.entity';
import { UUID } from '@common/type';
import { PaginationDto } from '@common/dto';

export class NoticeParamDto {
  @ApiProperty({
    description: '고유 아이디',
    example: 'id',
  })
  @IsUUID()
  noticeId?: UUID;
}

export class PostNoticeBodyDto {
  @ApiProperty({
    description: '공지 제목',
    example: '공지 제목',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '공지 내용',
    example: '공지 내용. 아마 html',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: '공지 상단 고정 여부',
    example: false,
  })
  @IsBoolean()
  pin: boolean;

  @ApiProperty({
    description: '공지 타입',
    example: NoticeCategory.NOTICE,
    enum: NoticeCategory,
  })
  @IsEnum(NoticeCategory)
  category: NoticeCategory;
}

export class PutNoticeBodyDto {
  @ApiProperty({
    description: '공지 제목',
    example: '공지 제목',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '공지 내용',
    example: '공지 내용. 아마 html',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: '공지 상단 고정 여부',
    example: false,
  })
  @IsBoolean()
  pin: boolean;

  @ApiProperty({
    description: '공지 타입',
    example: NoticeCategory.NOTICE,
    enum: NoticeCategory,
  })
  @IsEnum(NoticeCategory)
  category: NoticeCategory;
}

export class NoticeResponseDto {
  @ApiProperty({
    description: '고유 아이디',
    example: 'id',
  })
  id: UUID;

  @ApiProperty({
    description: '공지 제목',
    example: '공지 제목',
  })
  title: string;

  @ApiProperty({
    description: '공지 내용',
    example: '공지 내용. 아마 html',
  })
  content: string;

  @ApiProperty({
    description: '공지 상단 고정 여부',
    example: false,
  })
  pin: boolean;

  @ApiProperty({
    description: '공지 타입',
    example: NoticeCategory.NOTICE,
    enum: NoticeCategory,
  })
  category: NoticeCategory;

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

export class NoticeListResponseDto {
  @ApiProperty({
    description: '고유 아이디',
    example: 'id',
  })
  id: UUID;

  @ApiProperty({
    description: '공지 제목',
    example: '공지 제목',
  })
  title: string;

  @ApiProperty({
    description: '공지 상단 고정 여부',
    example: false,
  })
  pin: boolean;

  @ApiProperty({
    description: '공지 타입',
    example: NoticeCategory.NOTICE,
    enum: NoticeCategory,
  })
  category: NoticeCategory;

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

  constructor(notice: Notice) {
    this.id = notice.id;
    this.title = notice.title;
    this.pin = notice.pin;
    this.category = notice.category;
    this.createdAt = notice.createdAt;
    this.updatedAt = notice.updatedAt;
  }
}

export class GetNoticesResponseDto extends PaginationResponseDto<NoticeListResponseDto> {
  @ApiProperty({
    description: '리스트',
    type: [NoticeListResponseDto],
  })
  list: NoticeListResponseDto[];

  constructor({ list, totalCount }: PaginationResponseDto<Notice>) {
    super();
    this.list = list.map((notice) => new NoticeListResponseDto(notice));
    this.totalCount = totalCount;
  }
}

export class GetNoticesQueryDto extends PaginationDto {
  @ApiProperty({
    description: '공지 타입',
    example: NoticeCategory.NOTICE,
    enum: NoticeCategory,
    required: false,
  })
  @IsEnum(NoticeCategory)
  @IsOptional()
  category?: NoticeCategory;
}
