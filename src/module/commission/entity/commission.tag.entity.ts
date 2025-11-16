import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { UUID } from '@common/type';
import { Commission } from './commission.entity';
import { Tag } from 'src/module/tag/entity/tag.entity';

@Entity({ name: 'commission_tag' })
export class CommissionTag extends CommonBaseEntity {
  @Column({ name: 'commission_id', nullable: false, type: 'uuid' })
  @Index()
  commissionId: UUID;

  @Column({ name: 'tag_id', nullable: false, type: 'uuid' })
  @Index()
  tagId: UUID;

  @ManyToOne(() => Tag, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  @ManyToOne(() => Commission, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'commission_id' })
  commission: Commission;

  static of(createRequest: { tagId: UUID; commissionId: UUID }): CommissionTag {
    const commissionTag = new CommissionTag();
    commissionTag.tagId = createRequest.tagId;
    commissionTag.commissionId = createRequest.commissionId;
    return commissionTag;
  }
}
