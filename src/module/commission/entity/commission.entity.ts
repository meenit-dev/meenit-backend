import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UUID } from '@common/type';
import { User } from 'src/module/user/entity/user.entity';
import { CommissionTag } from './commission.tag.entity';
import { CommissionCategory } from '../type/commission.type';
import { CommissionOption } from './commission.option.entity';
import { CommissionThumbnail } from './commission.thumbnail.entity';

@Entity({ name: 'commission' })
export class Commission extends CommonBaseEntity {
  @Column({ name: 'user_id', nullable: false, type: 'uuid' })
  @Index()
  userId: UUID;

  @Column({ nullable: false, type: String })
  category: CommissionCategory;

  @Column({ nullable: false, type: String })
  title: string;

  @Column({ nullable: false, type: String })
  description: string;

  @Column({ nullable: false, type: String })
  contents: string;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => CommissionTag, (commissionTag) => commissionTag.commission)
  tags: CommissionTag[];

  @OneToMany(() => CommissionOption, (option) => option.commission)
  options: CommissionOption[];

  @OneToMany(() => CommissionThumbnail, (option) => option.commission)
  thumbnails: CommissionThumbnail[];

  static of(createRequest: {
    userId: UUID;
    category: CommissionCategory;
    title: string;
    description: string;
    contents: string;
  }) {
    const commission = new Commission();
    commission.userId = createRequest.userId;
    commission.category = createRequest.category;
    commission.title = createRequest.title;
    commission.description = createRequest.description;
    commission.contents = createRequest.contents;
    return commission;
  }

  update(updateRequest: {
    category?: CommissionCategory;
    title?: string;
    description?: string;
    contents?: string;
    url?: string;
    thumbnailUrl?: string;
  }) {
    this.category = updateRequest.category || this.category;
    this.title = updateRequest.title || this.title;
    this.description = updateRequest.description || this.description;
    return this;
  }
}
