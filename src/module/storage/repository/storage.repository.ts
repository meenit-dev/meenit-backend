import { Injectable, Logger } from '@nestjs/common';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { Resource } from '../entity/resource.entity';
import { ResourceProvider } from '../type/resource.type';
import { UUID } from '@common/type';
import { subMinutes } from 'date-fns';
import { StorageType } from '../type/storage.type';

@Injectable()
export class ResourceRepository extends CommonRepository<Resource> {
  protected readonly logger = new Logger(ResourceRepository.name);

  constructor(
    @InjectRepository(Resource)
    protected readonly repository: Repository<Resource>,
  ) {
    super();
  }

  async findOneByProviderAndKey(provider: ResourceProvider, key: string) {
    return this.repository.findOneBy({ provider, key });
  }

  async findNotUploadedByUserId(userId: UUID) {
    return this.repository.findBy({
      userId,
      uploaded: false,
      createdAt: LessThan(subMinutes(new Date(), 10)),
    });
  }

  async findPortfolioResourceSizeAndCountByUserId(userId: UUID) {
    const qb = this.repository
      .createQueryBuilder('r')
      .innerJoin(
        'portfolio',
        'p',
        'p.resource_id = r.id AND p.deleted_at IS NULL',
      )
      .select('SUM(r.size)', 'usedSize')
      .addSelect('COUNT(*)', 'fileCount')
      .where('r.userId = :userId', { userId })
      .andWhere('r.uploaded = :uploaded', { uploaded: true })
      .andWhere('r.type = :type', { type: StorageType.PORTFOLIO })
      .andWhere('r.deletedAt IS NULL')
      .groupBy('r.userId');

    const result = await qb.getRawOne<{
      usedSize: number;
      fileCount: number;
    }>();
    return {
      usedSize: Number(result?.usedSize ?? 0),
      fileCount: Number(result?.fileCount ?? 0),
    };
  }

  async softDeleteByProviderAndKey(provider: ResourceProvider, key: string) {
    return this.repository.softDelete({ provider, key });
  }
}
