import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: 'page 번호',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page: number;

  @ApiProperty({
    description: 'page 당 가져올 데이터 수. 최대 500',
    example: 20,
  })
  @Max(500)
  @Min(1)
  @IsNumber()
  @Type(() => Number)
  limit: number;
}

export class CursorPaginationDto {
  @ApiProperty({
    description: 'cursor key',
    example: 'cursor',
    required: false,
  })
  @IsString()
  @IsOptional()
  cursor?: string;

  @ApiProperty({
    description: '한번에 가져올 데이터 수. 최대 500',
    example: 20,
  })
  @Max(500)
  @Min(1)
  @IsNumber()
  @Type(() => Number)
  limit: number;
}

export class DurationDto {
  @ApiProperty({
    description: '날짜 조회 시작일',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  startAt: Date;

  @ApiProperty({
    description: '날짜 조회 종료일',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  endAt: Date;
}

export class DurationPaginationDto extends PaginationDto {
  @ApiProperty({
    description: '날짜 조회 시작일',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  startAt: Date;

  @ApiProperty({
    description: '날짜 조회 종료일',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  endAt: Date;
}

export class PositionXYDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'position x',
    example: 5699,
  })
  x: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'position y',
    example: 2258,
  })
  y: number;
}
