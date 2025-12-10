import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { UUID } from '@common/type';
import { CommissionThumbnail } from '../entity/commission.thumbnail.entity';

@Injectable()
export class CommissionThumbnailRepository extends CommonRepository<CommissionThumbnail> {
  protected readonly logger = new Logger(CommissionThumbnailRepository.name);

  constructor(
    @InjectRepository(CommissionThumbnail)
    protected readonly repository: Repository<CommissionThumbnail>,
  ) {
    super();
  }

  async deleteManyByCommissionId(commissionId: UUID) {
    return this.repository.softDelete({ commissionId });
  }
}
