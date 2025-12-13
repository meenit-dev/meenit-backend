import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { PortfolioCategory } from '../type/portfolio.type';
import { UUID } from '@common/type';
import { User } from 'src/module/user/entity/user.entity';
import { PortfolioTag } from './portfolio.tag.entity';
import { Resource } from 'src/module/storage/entity/resource.entity';
import { PortfolioLike } from './portfolio.like.entity';

@Entity({ name: 'portfolio' })
export class Portfolio extends CommonBaseEntity {
  @Column({ name: 'user_id', nullable: false, type: 'uuid' })
  @Index()
  userId: UUID;

  @Column({ nullable: false, type: String })
  category: PortfolioCategory;

  @Column({ nullable: true, type: String })
  description?: string;

  @Column({ name: 'resource_id', nullable: false, type: 'uuid' })
  @Index()
  resourceId: UUID;

  @Column({ name: 'thumbnail_url', nullable: true, type: String })
  thumbnailUrl?: string;

  @Column({ name: 'view_count', nullable: false, type: Number, default: 0 })
  viewCount: number;

  @Column({ name: 'like_count', nullable: false, type: Number, default: 0 })
  likeCount: number;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => PortfolioTag, (portfolioTag) => portfolioTag.portfolio)
  tags: PortfolioTag[];

  @OneToMany(() => PortfolioLike, (like) => like.portfolio)
  likes: PortfolioLike[];

  @OneToOne(() => Resource, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'resource_id' })
  resource: Resource;

  static of(createRequest: {
    userId: UUID;
    category: PortfolioCategory;
    description?: string;
    thumbnailUrl?: string;
    resourceId: UUID;
  }): Portfolio {
    const portfolio = new Portfolio();
    portfolio.userId = createRequest.userId;
    portfolio.category = createRequest.category;
    portfolio.description = createRequest.description;
    portfolio.thumbnailUrl = createRequest.thumbnailUrl;
    portfolio.resourceId = createRequest.resourceId;
    return portfolio;
  }

  update(updateRequest: {
    description?: string;
    category?: PortfolioCategory;
  }) {
    this.description = updateRequest.description;
    this.category = updateRequest.category || this.category;
    return this;
  }
}
