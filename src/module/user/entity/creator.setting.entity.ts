import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { UUID } from '@common/type';
import { SlotStatus } from 'src/module/commission/type/commission.type';

@Entity({ name: 'creator_setting' })
export class CreatorSetting extends CommonBaseEntity {
  @Column({ name: 'user_id', nullable: false, type: String })
  @Index()
  userId: UUID;

  @Column({ name: 'slot_month_split_count', nullable: false, type: Number })
  slotMonthSplitCount: number;

  @Column({ name: 'slot_defaul_status', nullable: false, type: String })
  slotDefaultStatus: SlotStatus;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: User;

  static of(userId: UUID): CreatorSetting {
    const setting = new CreatorSetting();
    setting.userId = userId;
    setting.slotMonthSplitCount = 1;
    setting.slotDefaultStatus = SlotStatus.UNSET;
    return setting;
  }

  update(update: {
    slot?: { monthSplitCount?: number; defaultStatus?: SlotStatus };
  }): CreatorSetting {
    this.slotMonthSplitCount =
      update.slot?.monthSplitCount || this.slotMonthSplitCount;
    this.slotDefaultStatus =
      update.slot?.defaultStatus || this.slotDefaultStatus;
    return this;
  }
}
