import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from '@common/type';
import { Slot } from '../entity/slot.entity';
import { IsOptionalDefined } from '@common/decorator/dto.decorator';
import { UserHandleParamDto } from '@common/dto/user.dto';
import { SlotStatus } from '../type/commission.type';
import { Type } from 'class-transformer';

export class SlotIdParamDto extends UserHandleParamDto {
  @ApiProperty({
    description: '고유 아이디',
    example: 'id',
  })
  @IsUUID()
  slotId?: UUID;
}

export class SlotResponseDto {
  @ApiProperty({
    description: 'slot 고유 아이디',
    example: 'id',
  })
  id: UUID;

  @ApiProperty({
    description: 'slot 설정 월',
    example: '2025-11',
  })
  month: string;

  @ApiProperty({
    description: 'slot 설정 월의 split 번호',
    example: 1,
  })
  split: number;

  @ApiProperty({
    description: 'slot 최대 수',
    example: 5,
  })
  count: number;

  @ApiProperty({
    description: 'slot 상태',
    example: SlotStatus.UNSET,
    enum: SlotStatus,
  })
  status: SlotStatus;

  constructor(slot: Slot) {
    this.id = slot.id;
    this.month = slot.month;
    this.split = slot.split;
    this.status = slot.status;
  }
}

export class GetSlotsResponseDto {
  @ApiProperty({
    description: 'slot 정보 리스트',
    type: [SlotResponseDto],
  })
  list: SlotResponseDto[];

  constructor(slots: Slot[]) {
    this.list = slots.map((slot) => new SlotResponseDto(slot));
  }
}

export class PatchSlotBodyDto {
  @ApiProperty({
    description: 'slot 상태',
    example: SlotStatus.UNSET,
    enum: SlotStatus,
    required: false,
  })
  @IsEnum(SlotStatus)
  @IsOptionalDefined()
  status?: SlotStatus;
}

export class SlotBatchDto {
  @ApiProperty({
    description: '고유 아이디',
    example: 'id',
  })
  @IsUUID()
  slotId: UUID;

  @ApiProperty({
    description: '변경할 slot 정보',
    type: [PatchSlotBodyDto],
  })
  @Type(() => PatchSlotBodyDto)
  @ValidateNested({ each: true })
  request?: PatchSlotBodyDto;
}

export class PatchSlotBatchBodyDto {
  @ApiProperty({
    description: '변경할 slot 정보 리스트',
    type: [SlotBatchDto],
  })
  @Type(() => SlotBatchDto)
  @ValidateNested({ each: true })
  list: SlotBatchDto[];
}
