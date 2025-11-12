import { Injectable, Logger } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { CommonRepository } from '@common/repository/common.repository';
import { SsoProvider } from 'src/module/auth/type/auth.type';
import { UUID } from '@common/type';

@Injectable()
export class UserRepository extends CommonRepository<User> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User) protected readonly repository: Repository<User>,
  ) {
    super();
  }

  async findOneWithProfileById(id: UUID) {
    return this.repository.findOne({
      where: { id: id },
      relations: {
        profile: true,
      },
    });
  }

  async findOneByProviderAndProviderId(
    provider: SsoProvider,
    providerId: string,
  ) {
    return this.repository.findOne({
      where: { [`${provider}Id`]: providerId },
    });
  }

  async findOneByHandle(handle: string): Promise<User | null> {
    return this.repository.findOne({
      where: { handle },
    });
  }

  async findUsersByIdsAndIsDeleted(ids: UUID[], isDeleted: boolean) {
    return this.repository.find({
      where: { id: In(ids) },
      withDeleted: isDeleted,
    });
  }
}
