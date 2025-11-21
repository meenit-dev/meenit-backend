import { Injectable, Logger } from '@nestjs/common';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { Resource } from '../entity/resource.entity';
import { ResourceProvider } from '../type/resource.type';
import { UUID } from '@common/type';
import { subMinutes } from 'date-fns';

@Injectable()
export class ResourceRepository extends CommonRepository<Resource> {
  protected readonly logger = new Logger(ResourceRepository.name);

  constructor(
    @InjectRepository(Resource)
    protected readonly repository: Repository<Resource>,
  ) {
    super();
  }

  findOneByProviderAndKey(provider: ResourceProvider, key: string) {
    return this.repository.findOneBy({ provider, key });
  }

  findNotUploadedByUserId(userId: UUID) {
    return this.repository.findBy({
      userId,
      uploaded: false,
      createdAt: LessThan(subMinutes(new Date(), 5)),
    });
  }

  softDeleteByProviderAndKey(provider: ResourceProvider, key: string) {
    return this.repository.softDelete({ provider, key });
  }
}
