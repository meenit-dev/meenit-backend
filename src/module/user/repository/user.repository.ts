import { Injectable, Logger } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { CommonRepository } from '@common/repository/common.repository';
import { SsoProvider } from 'src/module/auth/type/auth.type';
import { UUID } from '@common/type';
import { FindCreatorsPagination } from '../dto/user.query.dto';

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
      where: { id },
      relations: {
        profile: true,
      },
    });
  }

  async findOneWithProfileByHandle(handle: string) {
    return this.repository.findOne({
      where: { handle },
      relations: {
        profile: true,
      },
    });
  }

  async findCreatorsPagination(query: FindCreatorsPagination) {
    const qb = this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.portfolios', 'portfolio')
      .orderBy('portfolio.createdAt', 'DESC')
      .skip(query.limit * (query.page - 1))
      .take(query.limit);

    if (query.category) {
      qb.andWhere('portfolio.category = :category', {
        category: query.category,
      });
    }
    if (query.tagIds?.length) {
      qb.leftJoin('portfolio.tags', 'tag');
      qb.andWhere('tag.tagId IN (:...tagIds)', { tagIds: query.tagIds });
    }

    const [list, totalCount] = await qb.getManyAndCount();
    return { list, totalCount };
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
