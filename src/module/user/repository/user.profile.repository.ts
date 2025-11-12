import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { UserProfile } from '../entity/user.profile.entity';
import { UUID } from '@common/type';

@Injectable()
export class UserProfileRepository extends CommonRepository<UserProfile> {
  protected readonly logger = new Logger(UserProfileRepository.name);

  constructor(
    @InjectRepository(UserProfile)
    protected readonly repository: Repository<UserProfile>,
  ) {
    super();
  }

  async findOneByUserId(userId: UUID) {
    return this.repository.findOne({
      where: { userId },
    });
  }
}
