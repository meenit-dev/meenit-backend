import { Injectable } from '@nestjs/common';
import { NoticeRepository } from '../repository/notice.repository';
import { UUID } from '@common/type';
import {
  PostNoticeBodyDto,
  GetNoticesQueryDto,
  PutNoticeBodyDto,
} from '../dto/notice.dto';
import { Notice } from '../entity/notice.entity';
import { NotFoundError } from '@common/error';

@Injectable()
export class NoticeService {
  constructor(private readonly noticeRepository: NoticeRepository) {}

  async getNoticeById(id: UUID) {
    const notice = await this.noticeRepository.findOneById(id);
    if (!notice) {
      throw new NotFoundError();
    }
    return notice;
  }

  async createNotice(createReqeust: PostNoticeBodyDto) {
    return this.noticeRepository.save(Notice.of(createReqeust));
  }

  async updateNoticeById(id: UUID, updateReqeust: PutNoticeBodyDto) {
    const notice = await this.getNoticeById(id);
    return this.noticeRepository.save(notice.update(updateReqeust));
  }

  async deleteNoticeById(id: UUID) {
    return this.noticeRepository.deleteById(id);
  }

  async getNoticePagination(query: GetNoticesQueryDto) {
    const pinNotices = await this.noticeRepository.findNoticesByPinned();
    const { list, totalCount } =
      await this.noticeRepository.findNoticePagination(query);
    return { list: pinNotices.concat(list), totalCount };
  }
}
