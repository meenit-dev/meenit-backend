import { ApiProperty } from '@nestjs/swagger';
import { ReportReasonType, ReportTargetType } from '../type/report.type';
import { UUID } from '@common/type';
import {
  ArrayMaxSize,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateReportBodyDto {
  @ApiProperty({
    description: '신고 타입. 특정 카테고리 선택 안됐을 경우 유저로 설정',
    example: ReportTargetType.COMMISSION,
    enum: ReportReasonType,
    type: ReportTargetType,
  })
  targetType: ReportTargetType;

  @ApiProperty({
    description: '고유 아이디',
    example: 'targetId',
  })
  @IsUUID()
  targetId: UUID;

  @ApiProperty({
    description: '신고 사유',
    example: [ReportReasonType.COPYRIGHT_INFRINGEMENT],
    enum: ReportReasonType,
    type: [ReportReasonType],
  })
  @IsEnum(ReportReasonType, { each: true })
  types: ReportReasonType[];

  @ApiProperty({
    description: '신고 사유. 최소 20자. 최대 500자',
    example: '신고 사유. 최소 20자. 최대 500자',
  })
  @IsString()
  @MinLength(20)
  @MaxLength(500)
  reason: string;

  @ApiProperty({
    description: '신고 파일 url. 최대 10개',
    example: ['신고 파일 url. 최대 10개'],
    type: [String],
  })
  @IsString({ each: true })
  @ArrayMaxSize(10)
  @IsOptional()
  resources?: string[];
}
