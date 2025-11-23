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
