import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { UUID } from '@common/type';
import { User } from 'src/module/user/entity/user.entity';
import { Portfolio } from './portfolio.entity';

@Entity({ name: 'portfolio_like' })
@Index(['userId', 'portfolioId'], { unique: true })
export class PortfolioLike extends CommonBaseEntity {
  @Column({ name: 'user_id', nullable: false, type: 'uuid' })
  userId: UUID;

  @Column({ name: 'portfolio_id', nullable: false, type: 'uuid' })
  portfolioId: UUID;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Portfolio, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'portfolio_id' })
  portfolio: Portfolio;

  static of(createRequest: { userId: UUID; portfolioId: UUID }): PortfolioLike {
    const portfolioLike = new PortfolioLike();
    portfolioLike.userId = createRequest.userId;
    portfolioLike.portfolioId = createRequest.portfolioId;
    return portfolioLike;
  }
}
