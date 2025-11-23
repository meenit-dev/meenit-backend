import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity, Index } from 'typeorm';
import { UUID } from '@common/type';

@Entity({ name: 'slot' })
@Index(['userId', 'month'], { unique: true })
export class Slot extends CommonBaseEntity {
  @Column({ name: 'user_id', nullable: false, type: 'uuid' })
  @Index()
  userId: UUID;

  @Column({ nullable: false, type: String })
  month: string;

  @Column({ nullable: false, type: Number })
  count: number;

  @Column({ nullable: false, type: Boolean })
  active: boolean;

  static of(createRequest: {
    userId: UUID;
    month: string;
    count?: number;
    active?: boolean;
  }) {
    const slot = new Slot();
    slot.userId = createRequest.userId;
    slot.month = createRequest.month;
    slot.count = createRequest.count ?? 5;
    slot.active = createRequest.active ?? true;
    return slot;
  }

  update(updateRequest: { count?: number; active?: boolean }) {
    this.count = updateRequest.count ?? this.count;
    this.active = updateRequest.active ?? this.active;
    return this;
  }
}
