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

  @Column({ nullable: true, type: String })
  url?: string;

  @Column({ name: 'thumbnail_url', nullable: true, type: String })
  thumbnailUrl?: string;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => CommissionTag, (commissionTag) => commissionTag.commission)
  tags: CommissionTag[];

  @OneToMany(() => CommissionOption, (option) => option.commission)
  options: CommissionOption[];

  static of(createRequest: {
    userId: UUID;
    category: CommissionCategory;
    title: string;
    description: string;
    contents: string;
    url?: string;
    thumbnailUrl?: string;
  }) {
    const commission = new Commission();
    commission.userId = createRequest.userId;
    commission.category = createRequest.category;
    commission.title = createRequest.title;
    commission.description = createRequest.description;
    commission.contents = createRequest.contents;
    commission.url = createRequest.url;
    commission.thumbnailUrl = createRequest.thumbnailUrl;
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
    this.url = updateRequest.url || this.url;
    this.thumbnailUrl = updateRequest.thumbnailUrl || this.thumbnailUrl;
    return this;
  }
}
