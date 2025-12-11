import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { UUID } from '@common/type';
import { Portfolio } from '../entity/portfolio.entity';
import { CursorPaginationDto, PaginationDto } from '@common/dto';
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

  async findOneWithTagAndResourceAndLikeAndUserById(
    id: UUID,
    requestUserId?: UUID,
  ) {
    const qb = this.repository
      .createQueryBuilder('portfolio')
      .where('portfolio.id = :id', { id })
      .leftJoinAndSelect('portfolio.user', 'user')
      .leftJoinAndSelect('portfolio.tags', 'pt')
      .leftJoinAndSelect('pt.tag', 'tag')
      .leftJoinAndSelect('portfolio.resource', 'resource');

    if (requestUserId) {
      qb.leftJoinAndSelect(
        'portfolio.likes',
        'pl',
        'pl.userId = :requestUserId',
        { requestUserId },
      );
    }
    return qb.getOne();
  }

  async findAllPaginationByUserIdAndCategory(
    cursor: string | null,
    userId: UUID | null,
    category: PortfolioCategory | null,
    requestUserId: UUID | null,
    paginationOptions: CursorPaginationDto,
  ) {
    const qb = this.repository
      .createQueryBuilder('portfolio')
      .where(userId ? 'portfolio.userId = :userId' : '1=1', {
        userId,
      });
    if (cursor) {
      qb.andWhere('portfolio.id < :id', {
        id: cursor,
      });
    }
    if (category) {
      qb.andWhere('portfolio.category = :category', {
        category,
      });
    }

    qb.leftJoinAndSelect('portfolio.user', 'user')
      .leftJoinAndSelect('portfolio.tags', 'pt')
      .leftJoinAndSelect('pt.tag', 'tag')
      .leftJoinAndSelect('portfolio.resource', 'resource');

    if (requestUserId) {
      qb.leftJoinAndSelect(
        'portfolio.likes',
        'pl',
        'pl.userId = :requestUserId',
        { requestUserId },
      );
    }

    qb.take(paginationOptions.limit + 1);
    qb.orderBy('portfolio.id', 'DESC');

    const list = await qb.getMany();
    return {
      list: list.slice(0, paginationOptions.limit),
      nextCursor: list[paginationOptions.limit]
        ? list[paginationOptions.limit - 1].id
        : null,
    };
  }

  async findAllPaginationByCategory(
    category: PortfolioCategory | null,
    requestUserId: UUID | null,
    paginationOptions: PaginationDto,
  ) {
    const qb = this.repository
      .createQueryBuilder('portfolio')
      .where(category ? 'portfolio.category = :category' : '1=1', {
        category,
      });

    qb.leftJoinAndSelect('portfolio.user', 'user')
      .leftJoinAndSelect('portfolio.tags', 'pt')
      .leftJoinAndSelect('pt.tag', 'tag')
      .leftJoinAndSelect('portfolio.resource', 'resource');

    if (requestUserId) {
      qb.leftJoinAndSelect(
        'portfolio.likes',
        'pl',
        'pl.userId = :requestUserId',
        { requestUserId },
      );
    }

    const skip = paginationOptions.limit * (paginationOptions.page - 1);
    qb.skip(skip).take(paginationOptions.limit);
    qb.orderBy('portfolio.createdAt', 'DESC');

    const [list, totalCount] = await qb.getManyAndCount();
    return { list, totalCount };
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
