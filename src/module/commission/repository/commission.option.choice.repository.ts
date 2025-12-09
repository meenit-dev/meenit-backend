import { Injectable, Logger } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { UUID } from '@common/type';
import { CommissionOptionChoice } from '../entity/commission.option.choice.entity';

@Injectable()
export class CommissionOptionChoiceRepository extends CommonRepository<CommissionOptionChoice> {
  protected readonly logger = new Logger(CommissionOptionChoiceRepository.name);

  constructor(
    @InjectRepository(CommissionOptionChoice)
    protected readonly repository: Repository<CommissionOptionChoice>,
  ) {
    super();
  }

  async deleteManyByOptionIds(optionIds: UUID[]) {
    return this.repository.softDelete({ optionId: In(optionIds) });
  }
}
