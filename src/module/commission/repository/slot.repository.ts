import { Injectable, Logger } from '@nestjs/common';
import { Between, LessThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { Slot } from '../entity/slot.entity';
import { UUID } from '@common/type';

@Injectable()
export class SlotRepository extends CommonRepository<Slot> {
  protected readonly logger = new Logger(SlotRepository.name);

  constructor(
    @InjectRepository(Slot)
    protected readonly repository: Repository<Slot>,
  ) {
    super();
  }

  async findManyUserIdAndDurationMonthAndSplit(
    userId: UUID,
    startMonth: string,
    endMonth: string,
    split: number,
  ) {
    return this.repository.find({
      where: {
        userId,
        month: Between(startMonth, endMonth),
        split: LessThanOrEqual(split),
      },
      order: { month: 1 },
    });
  }
}
