import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { Inquiry } from '../entity/inquiry.entity';
import { Order, UUID } from '@common/type';
import { GetInquiriesQueryDto } from '../dto/inquiry.dto';

@Injectable()
export class InquiryRepository extends CommonRepository<Inquiry> {
  protected readonly logger = new Logger(InquiryRepository.name);

  constructor(
    @InjectRepository(Inquiry)
    protected readonly repository: Repository<Inquiry>,
  ) {
    super();
  }

  async findInquiriesPaginationByUserId(
    userId: UUID,
    query: GetInquiriesQueryDto,
  ) {
    return this.findAllPagination({
      where: {
        userId,
        ...(query.category ? { category: query.category } : {}),
      },
      order: { createdAt: Order.DESC },
      paginationOptions: query,
    });
  }

  async findOneWithAnswerByUserIdAndId(userId: UUID, id: UUID) {
    return this.repository.findOne({
      where: { userId, id },
      relations: { answer: true },
    });
  }
}
