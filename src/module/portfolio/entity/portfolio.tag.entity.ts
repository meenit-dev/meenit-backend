import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { UUID } from '@common/type';
import { Portfolio } from './portfolio.entity';
import { Tag } from 'src/module/tag/entity/tag.entity';

@Entity({ name: 'portfolio_tag' })
@Index(['portfolioId', 'tagId'])
export class PortfolioTag extends CommonBaseEntity {
  @Column({ name: 'portfolio_id', nullable: false, type: 'uuid' })
  portfolioId: UUID;

  @Column({ name: 'tag_id', nullable: false, type: 'uuid' })
  tagId: UUID;

  @ManyToOne(() => Tag, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  @ManyToOne(() => Portfolio, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'portfolio_id' })
  portfolio: Portfolio;

  static of(createRequest: { tagId: UUID; portfolioId: UUID }): PortfolioTag {
    const portfolioTag = new PortfolioTag();
    portfolioTag.tagId = createRequest.tagId;
    portfolioTag.portfolioId = createRequest.portfolioId;
    return portfolioTag;
  }
}
