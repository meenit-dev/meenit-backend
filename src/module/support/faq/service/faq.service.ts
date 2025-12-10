import { Injectable } from '@nestjs/common';
import { FaqRepository } from '../repository/faq.repository';
import { UUID } from '@common/type';
import { PostFaqBodyDto, PutFaqBodyDto } from '../dto/faq.dto';
import { Faq } from '../entity/faq.entity';
import { NotFoundError } from '@common/error';
import { FaqCategory } from '../type/faq.type';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class FaqService {
  constructor(private readonly faqRepository: FaqRepository) {}

  async getFaqById(id: UUID) {
    const faq = await this.faqRepository.findOneById(id);
    if (!faq) {
      throw new NotFoundError();
    }
    return faq;
  }

  @Transactional()
  async createFaq(createReqeust: PostFaqBodyDto) {
    const faqs = await this.faqRepository.findFaqsByCategory(
      createReqeust.category,
    );
    const index = faqs.findIndex((faq) => faq.order === createReqeust.order);
    const faq = Faq.of(createReqeust);
    if (index !== -1) {
      faqs.splice(index, 0, faq);
    } else {
      faqs.push(faq);
    }
    await Promise.all(
      faqs
        .map((_faq, i) => {
          if (_faq.id === faq.id) {
            return this.faqRepository.save(faq);
          } else if (_faq.order !== i) {
            return this.faqRepository.save(_faq.updateOrder(i));
          }
        })
        .filter((v) => v),
    );
  }

  @Transactional()
  async updateFaqById(id: UUID, updateReqeust: PutFaqBodyDto) {
    const faq = await this.getFaqById(id);
    const faqs = await this.faqRepository.findFaqsByCategory(faq.category);
    await Promise.all(
      faqs
        .map((_faq, i) => {
          if (_faq.id === faq.id) {
            return this.faqRepository.save(faq.update(updateReqeust));
          } else if (_faq.order !== i) {
            return this.faqRepository.save(_faq.updateOrder(i));
          }
        })
        .filter((v) => v),
    );
  }

  @Transactional()
  async deleteFaqById(id: UUID) {
    const faq = await this.getFaqById(id);
    await this.faqRepository.deleteById(id);
    const faqs = await this.faqRepository.findFaqsByCategory(faq.category);
    await this.sortFaqsOrder(faqs);
  }

  async sortFaqsOrder(faqs: Faq[]) {
    await Promise.all(
      faqs
        .map((_faq, i) => {
          if (_faq.order !== i) {
            return this.faqRepository.save(_faq.updateOrder(i));
          }
        })
        .filter((v) => v),
    );
  }

  async getFaqsByCategory(category: FaqCategory) {
    return this.faqRepository.findFaqsByCategory(category);
  }
}
