import { Injectable, Logger } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { CommonRepository } from '@common/repository/common.repository';
import { SsoProvider } from 'src/module/auth/type/auth.type';
import { UUID } from '@common/type';
import { UserType } from '../type/user.type';
import { FindCreatorsPagination } from 'src/module/user/dto/user.query.dto';
import { Portfolio } from 'src/module/portfolio/entity/portfolio.entity';

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

  async findOneWithCreatorSettingById(id: UUID) {
    return this.repository.findOne({
      where: { id },
      relations: {
        creatorSetting: true,
      },
    });
  }

  async findOneWithCreatorSettingByHandle(handle: string) {
    return this.repository.findOne({
      where: { handle },
      relations: {
        creatorSetting: true,
      },
    });
  }

  async findCreatorsTopPortfolios(query: FindCreatorsPagination) {
    const qb = this.repository
      .createQueryBuilder('user')
      .where('user.type = :type', { type: UserType.CREATOR })
      .skip(query.limit * (query.page - 1))
      .take(query.limit);

    const portfolioSub = qb
      .subQuery()
      .select('p.id')
      .from(Portfolio, 'p')
      .where('p.user_id = user.id')
      .orderBy('p.created_at', 'DESC')
      .limit(5);

    if (query.category) {
      portfolioSub.andWhere('p.category = :category', {
        category: query.category,
      });
    }

    if (query.tagIds?.length) {
      portfolioSub
        .leftJoin('p.tags', 'pt')
        .andWhere('pt.tagId IN (:...tagIds)', { tagIds: query.tagIds });
    }

    qb.leftJoinAndMapMany(
      'user.portfolios',
      Portfolio,
      'portfolios',
      `portfolios.id IN (${portfolioSub.getQuery()})`,
    );
    qb.setParameters(portfolioSub.getParameters());
    qb.orderBy('portfolios.createdAt', 'DESC');

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
