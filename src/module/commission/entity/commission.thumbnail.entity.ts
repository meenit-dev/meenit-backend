import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Commission } from './commission.entity';
import { UUID } from '@common/type';
import { Resource } from 'src/module/storage/entity/resource.entity';

@Entity({ name: 'commission_thumbnail' })
export class CommissionThumbnail extends CommonBaseEntity {
  @Column({ name: 'commission_id', nullable: false, type: 'uuid' })
  @Index()
  commissionId: UUID;

  @Column({ name: 'resource_id', nullable: false, type: 'uuid' })
  resourceId: UUID;

  @Column({ type: Number })
  order: number;

  @ManyToOne(() => Commission, (c) => c.thumbnails, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'commission_id' })
  commission: Commission;

  @OneToOne(() => Resource, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'resource_id' })
  resource: Resource;

  static of(createRequest: {
    commissionId: UUID;
    resourceId: UUID;
    order: number;
  }) {
    const thumbnail = new CommissionThumbnail();
    thumbnail.commissionId = createRequest.commissionId;
    thumbnail.resourceId = createRequest.resourceId;
    thumbnail.order = createRequest.order;
    return thumbnail;
  }
}
