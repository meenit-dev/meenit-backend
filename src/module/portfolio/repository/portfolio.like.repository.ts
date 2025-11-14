import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { PortfolioLike } from '../entity/portfolio.like.entity';
import { UUID } from '@common/type';

@Injectable()
export class PortfolioLikeRepository extends CommonRepository<PortfolioLike> {
  protected readonly logger = new Logger(PortfolioLikeRepository.name);

  constructor(
    @InjectRepository(PortfolioLike)
    protected readonly repository: Repository<PortfolioLike>,
  ) {
    super();
  }

  async findOneByUserIdAndPortfolioId(userId: UUID, portfolioId: UUID) {
    return this.repository.findOne({
      where: {
        userId,
        portfolioId,
      },
    });
  }

  async deleteByUserIdAndPortfolioId(userId: UUID, portfolioId: UUID) {
    return this.repository.delete({
      userId,
      portfolioId,
    });
  }
}
