import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { UUID } from '@common/type';
import { Portfolio } from '../entity/portfolio.entity';
import { PaginationDto } from '@common/dto';
import { PortfolioCategory } from '../type/portfolio.type';

@Injectable()
export class PortfolioRepository extends CommonRepository<Portfolio> {
  protected readonly logger = new Logger(PortfolioRepository.name);

  constructor(
    @InjectRepository(Portfolio)
    protected readonly repository: Repository<Portfolio>,
  ) {
    super();
  }

  async findOneWithTagAndResourceById(id: UUID) {
    return this.repository.findOne({
      where: { id },
      relations: { tags: { tag: true }, resource: true },
    });
  }

  async findAllPaginationByUserIdAndCategory(
    userId: UUID,
    category: PortfolioCategory | null,
    paginationOptions: PaginationDto,
  ) {
    return this.findAllPagination({
      where: { userId, ...(category ? { category } : {}) },
      paginationOptions,
      order: { createdAt: -1 },
    });
  }

  async increseViewCountById(id: UUID) {
    await this.repository.increment({ id }, 'viewCount', 1);
  }

  async increseLikeCountById(id: UUID) {
    await this.repository.increment({ id }, 'likeCount', 1);
  }

  async decreseLikeCountById(id: UUID) {
    await this.repository.decrement({ id }, 'likeCount', 1);
  }
}
