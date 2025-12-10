import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { UUID } from '@common/type';
import { Commission } from '../entity/commission.entity';
import { PaginationDto } from '@common/dto';
import { CommissionCategory } from '../type/commission.type';

@Injectable()
export class CommissionRepository extends CommonRepository<Commission> {
  protected readonly logger = new Logger(CommissionRepository.name);

  constructor(
    @InjectRepository(Commission)
    protected readonly repository: Repository<Commission>,
  ) {
    super();
  }

  async findOneWithTagAndUserById(id: UUID) {
    return this.repository.findOne({
      where: { id },
      relations: {
        tags: { tag: true },
        user: true,
        options: { choices: true },
        thumbnails: { resource: true },
      },
    });
  }

  async findAllWithUserAndTagPaginationCategory(
    category: CommissionCategory | null,
    paginationOptions: PaginationDto,
  ) {
    return this.findAllPagination({
      where: { ...(category ? { category } : {}) },
      paginationOptions,
      order: { createdAt: -1 },
      relations: {
        tags: { tag: true },
        user: true,
        thumbnails: { resource: true },
      },
    });
  }

  async findAllWithUserAndTagPaginationByUserIdAndCategory(
    userId: UUID,
    category: CommissionCategory | null,
    paginationOptions: PaginationDto,
  ) {
    return this.findAllPagination({
      where: { userId, ...(category ? { category } : {}) },
      paginationOptions,
      order: { createdAt: -1 },
      relations: {
        tags: { tag: true },
        user: true,
        thumbnails: { resource: true },
      },
    });
  }
}
