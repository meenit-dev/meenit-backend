import { Injectable, Logger } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { UserAuthToken } from '../entity/user.auth.token.entity';

@Injectable()
export class UserAuthTokenRepository extends CommonRepository<UserAuthToken> {
  protected readonly logger = new Logger(UserAuthTokenRepository.name);

  constructor(
    @InjectRepository(UserAuthToken)
    protected readonly repository: Repository<UserAuthToken>,
  ) {
    super();
  }

  async findOneByAccessToken(accessToken: string) {
    return this.repository.findOneBy({ access: accessToken });
  }

  async findOneNoUsedByRefreshToken(refreshToken: string) {
    return this.repository.findOneBy({
      refresh: refreshToken,
      usedAt: IsNull(),
    });
  }
}
