import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { Account } from '../entity/account.entity';
import { UUID } from '@common/type';

@Injectable()
export class AccountRepository extends CommonRepository<Account> {
  protected readonly logger = new Logger(AccountRepository.name);

  constructor(
    @InjectRepository(Account)
    protected readonly repository: Repository<Account>,
  ) {
    super();
  }

  async findOneByUserId(userId: UUID) {
    return this.repository.findOne({
      where: { userId },
    });
  }
}
