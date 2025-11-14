import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '../entity/tag.entity';
import { IsOptional } from 'class-validator';

export class GetTagsQueryDto {
  @ApiProperty({
    description: '태그 이름',
    example: 'SD',
    required: false,
  })
  @IsOptional()
  name?: string;
}

export class TagsResponseDto {
  @ApiProperty({
    description: '태그 이름',
    example: '홍길동',
  })
  name: string;

  @ApiProperty({
    description: '태그 사용 횟수',
    example: 2000,
  })
  count: number;
}

export class GetTagsResponseDto {
  @ApiProperty({
    description: 'tag 정보 리스트',
    type: [TagsResponseDto],
  })
  list: TagsResponseDto[];

  constructor(tags: Tag[]) {
    this.list = tags.map(({ name, count }) => ({ name, count }));
  }
}
