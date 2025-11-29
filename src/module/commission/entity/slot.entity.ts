import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity, Index } from 'typeorm';
import { UUID } from '@common/type';
import { SlotStatus } from '../type/commission.type';

@Entity({ name: 'slot' })
@Index(['userId', 'month', 'split'], { unique: true })
export class Slot extends CommonBaseEntity {
  @Column({ name: 'user_id', nullable: false, type: 'uuid' })
  @Index()
  userId: UUID;

  @Column({ nullable: false, type: String })
  month: string;

  @Column({ nullable: false, type: Number })
  split: number;

  @Column({ nullable: false, type: String })
  status: SlotStatus;

  static of(createRequest: {
    userId: UUID;
    month: string;
    split: number;
    count?: number;
    status?: SlotStatus;
  }) {
    const slot = new Slot();
    slot.userId = createRequest.userId;
    slot.month = createRequest.month;
    slot.split = createRequest.split;
    slot.status = createRequest.status ?? SlotStatus.UNSET;
    return slot;
  }

  update(updateRequest: { status?: SlotStatus }) {
    this.status = updateRequest.status ?? this.status;
    return this;
  }
}
