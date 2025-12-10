import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { Faq } from '../entity/faq.entity';
import { FaqCategory } from '../type/faq.type';
import { Order } from '@common/type';

@Injectable()
export class FaqRepository extends CommonRepository<Faq> {
  protected readonly logger = new Logger(FaqRepository.name);

  constructor(
    @InjectRepository(Faq)
    protected readonly repository: Repository<Faq>,
  ) {
    super();
  }

  async findFaqsByCategory(category: FaqCategory) {
    return this.repository.find({
      where: { category },
      order: { order: Order.ASC },
    });
  }
}
