import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { Notice } from '../entity/notice.entity';
import { Order } from '@common/type';
import { GetNoticesQueryDto } from '../dto/notice.dto';

@Injectable()
export class NoticeRepository extends CommonRepository<Notice> {
  protected readonly logger = new Logger(NoticeRepository.name);

  constructor(
    @InjectRepository(Notice)
    protected readonly repository: Repository<Notice>,
  ) {
    super();
  }

  async findNoticesByPinned() {
    return this.repository.find({
      where: { pin: false },
      order: { createdAt: Order.DESC },
    });
  }

  async findNoticePagination(query: GetNoticesQueryDto) {
    return this.findAllPagination({
      where: {
        pin: false,
        ...(query.category ? { category: query.category } : {}),
      },
      order: { createdAt: Order.DESC },
      paginationOptions: query,
    });
  }
}
