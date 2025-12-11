import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  @ApiProperty({
    description: '리스트',
    type: Array<T>,
  })
  list: T[];

  @ApiProperty({
    description: '총 개수',
    example: 120,
  })
  totalCount: number;
}

export class CursorPaginationResponseDto<T> {
  @ApiProperty({
    description: '리스트',
    type: Array<T>,
  })
  list: T[];

  @ApiProperty({
    description: '다음 커서. 다음 데이터가 없을 경우 null',
    example: 'cursor',
    nullable: true,
  })
  nextCursor?: string;
}
