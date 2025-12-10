import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity } from 'typeorm';
import { FaqCategory } from '../type/faq.type';

@Entity({ name: 'faq' })
export class Faq extends CommonBaseEntity {
  @Column({ type: String })
  title: string;

  @Column({ type: String })
  content: string;

  @Column({ type: Number })
  order: number;

  @Column({ type: String })
  category: FaqCategory;

  static of(createRequest: {
    title: string;
    content: string;
    order: number;
    category: FaqCategory;
  }): Faq {
    const faq = new Faq();
    faq.title = createRequest.title;
    faq.content = createRequest.content;
    faq.order = createRequest.order;
    faq.category = createRequest.category;
    return faq;
  }

  update(updateRequest: {
    title: string;
    content: string;
    order: number;
    category: FaqCategory;
  }): Faq {
    this.title = updateRequest.title;
    this.content = updateRequest.content;
    this.order = updateRequest.order;
    this.category = updateRequest.category;
    return this;
  }

  updateOrder(order: number) {
    this.order = order;
    return this;
  }
}
