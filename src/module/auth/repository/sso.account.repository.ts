import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { SsoAccount } from '../entity/sso.account.entity';
import { SsoProvider } from '../type/auth.type';

@Injectable()
export class SsoAccountRepository extends CommonRepository<SsoAccount> {
  protected readonly logger = new Logger(SsoAccountRepository.name);

  constructor(
    @InjectRepository(SsoAccount)
    protected readonly repository: Repository<SsoAccount>,
  ) {
    super();
  }

  async findOneByProviderAndSsoId(provider: SsoProvider, ssoId: string) {
    return this.repository.findOneBy({ provider, ssoId });
  }
}
