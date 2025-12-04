import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { Follow } from '../entity/follow.entity';
import { UUID } from '@common/type';
import { PaginationDto } from '@common/dto';

@Injectable()
export class FollowRepository extends CommonRepository<Follow> {
  protected readonly logger = new Logger(FollowRepository.name);

  constructor(
    @InjectRepository(Follow)
    protected readonly repository: Repository<Follow>,
  ) {
    super();
  }

  async deleteByUserIdAndFollowUserId(userId: UUID, followUserId: UUID) {
    return this.repository.softDelete({ userId, followUserId });
  }

  async findOneByUserIdAndFollowUserId(userId: UUID, followUserId: UUID) {
    return this.repository.findOneBy({ userId, followUserId });
  }

  async findFollowerWithUserPaginationByUserId(
    userId: UUID,
    query: PaginationDto,
  ) {
    return this.findAllPagination({
      where: { followUserId: userId },
      relations: { user: true },
      paginationOptions: query,
      order: {
        createdAt: -1,
      },
    });
  }

  async findFollowingWithUserPaginationByUserId(
    userId: UUID,
    query: PaginationDto,
  ) {
    return this.findAllPagination({
      where: { userId },
      relations: { followUser: true },
      paginationOptions: query,
      order: {
        createdAt: -1,
      },
    });
  }
}
