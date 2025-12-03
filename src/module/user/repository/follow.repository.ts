import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { Follow } from '../entity/follow.entity';
import { UUID } from '@common/type';

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
}
