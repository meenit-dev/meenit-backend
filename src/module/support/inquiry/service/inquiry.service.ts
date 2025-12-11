import { Injectable } from '@nestjs/common';
import { InquiryRepository } from '../repository/inquiry.repository';
import { UUID } from '@common/type';
import { GetInquiriesQueryDto, PostInquiryBodyDto } from '../dto/inquiry.dto';
import { Inquiry } from '../entity/inquiry.entity';
import { NotFoundError } from '@common/error';
import { Transactional } from 'typeorm-transactional';
import { ResourceService } from 'src/module/storage/service/resource.service';
import { InquiryResourceRepository } from '../repository/inquiry.resource.repository';
import { InquiryResource } from '../entity/inquiry.resource.entity';
import { StorageType } from 'src/module/storage/type/storage.type';
import { InquiryAnswerRepository } from '../repository/inquiry.answer.repository';
import { InquiryAnswer } from '../entity/inquiry.answer.entity';
import {
  PostInquiryAnswerBodyDto,
  PutInquiryAnswerBodyDto,
} from '../dto/inquiry.answer.dto';

@Injectable()
export class InquiryService {
  constructor(
    private readonly inquiryRepository: InquiryRepository,
    private readonly inquiryResourceRepository: InquiryResourceRepository,
    private readonly inquiryAnswerRepository: InquiryAnswerRepository,
    private readonly resourceService: ResourceService,
  ) {}

  async getInquiryWithAnswerByUserIdAndId(userId: UUID, id: UUID) {
    const inquiry = await this.inquiryRepository.findOneWithAnswerByUserIdAndId(
      userId,
      id,
    );
    if (!inquiry) {
      throw new NotFoundError();
    }
    return inquiry;
  }

  async getInquiryById(id: UUID) {
    const inquiry = await this.inquiryRepository.findOneById(id);
    if (!inquiry) {
      throw new NotFoundError();
    }
    return inquiry;
  }

  async getInquiryAnswerById(id: UUID) {
    const answer = await this.inquiryAnswerRepository.findOneById(id);
    if (!answer) {
      throw new NotFoundError();
    }
    return answer;
  }

  async createInquiryAnswer(
    inquiryId: UUID,
    createRequest: PostInquiryAnswerBodyDto,
  ) {
    const inquiry = await this.getInquiryById(inquiryId);
    const answer = await this.inquiryAnswerRepository.save(
      InquiryAnswer.of({
        inquiryId: inquiry.id,
        content: createRequest.content,
      }),
    );
    await this.inquiryRepository.save(
      inquiry.updateAnsweredAt(answer.createdAt),
    );
  }

  async updateInquiryAnswer(
    inquiryAnswerId: UUID,
    updateRequest: PutInquiryAnswerBodyDto,
  ) {
    const answer = await this.getInquiryAnswerById(inquiryAnswerId);
    await this.inquiryAnswerRepository.save(answer.update(updateRequest));
  }

  @Transactional()
  async createInquiry(userId: UUID, createRequest: PostInquiryBodyDto) {
    const inquiry = await this.inquiryRepository.save(
      Inquiry.of({ ...createRequest, userId }),
    );
    if (createRequest.resources) {
      const resources = await Promise.all(
        createRequest.resources.map((url) =>
          this.resourceService.uploadedOrCreateOtherResource(
            userId,
            StorageType.INQUIRY,
            url,
          ),
        ),
      );
      await this.inquiryResourceRepository.saveMany(
        resources.map((resource) =>
          InquiryResource.of({
            inquiryId: inquiry.id,
            resourceId: resource.id,
          }),
        ),
      );
    }
  }

  async getInquiriesPaginationByUserId(
    userId: UUID,
    query: GetInquiriesQueryDto,
  ) {
    return this.inquiryRepository.findInquiriesPaginationByUserId(
      userId,
      query,
    );
  }
}
