import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsUUID } from 'class-validator';
import { UUID } from '@common/type';
import { Slot } from '../entity/slot.entity';
import { IsOptionalDefined } from '@common/decorator/dto.decorator';
import { UserHandleParamDto } from '@common/dto/user.dto';

export class SlotIdtParamDto extends UserHandleParamDto {
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
    description: 'slot 최대 수',
    example: 5,
  })
  count: number;

  @ApiProperty({
    description: 'slot 활성화 여부',
    example: true,
  })
  active: boolean;

  constructor(slot: Slot) {
    this.id = slot.id;
    this.month = slot.month;
    this.count = slot.count;
    this.active = slot.active;
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
    description: 'slot 최대 수',
    example: 5,
    required: false,
  })
  @IsNumber()
  @IsOptionalDefined()
  count?: number;

  @ApiProperty({
    description: 'slot 활성화 여부',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptionalDefined()
  active?: boolean;
}
