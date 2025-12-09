import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { UUID } from '@common/type';
import { CommissionOption } from '../entity/commission.option.entity';

@Injectable()
export class CommissionOptionRepository extends CommonRepository<CommissionOption> {
  protected readonly logger = new Logger(CommissionOptionRepository.name);

  constructor(
    @InjectRepository(CommissionOption)
    protected readonly repository: Repository<CommissionOption>,
  ) {
    super();
  }

  async deleteManyByCommissionId(commissionId: UUID) {
    return this.repository.softDelete({ commissionId });
  }
}
