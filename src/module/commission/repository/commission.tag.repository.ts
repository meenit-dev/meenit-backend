import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { CommissionTag } from '../entity/commission.tag.entity';
import { UUID } from '@common/type';

@Injectable()
export class CommissionTagRepository extends CommonRepository<CommissionTag> {
  protected readonly logger = new Logger(CommissionTagRepository.name);

  constructor(
    @InjectRepository(CommissionTag)
    protected readonly repository: Repository<CommissionTag>,
  ) {
    super();
  }

  async deleteManyByCommissionId(commissionId: UUID) {
    return await this.repository.softDelete({ commissionId });
  }
}
