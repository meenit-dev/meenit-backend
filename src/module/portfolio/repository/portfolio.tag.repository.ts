import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { PortfolioTag } from '../entity/portfolio.tag.entity';
import { UUID } from '@common/type';

@Injectable()
export class PortfolioTagRepository extends CommonRepository<PortfolioTag> {
  protected readonly logger = new Logger(PortfolioTagRepository.name);

  constructor(
    @InjectRepository(PortfolioTag)
    protected readonly repository: Repository<PortfolioTag>,
  ) {
    super();
  }

  async deleteManyByPortfolioId(portfolioId: UUID) {
    return await this.repository.softDelete({ portfolioId: portfolioId });
  }
}
