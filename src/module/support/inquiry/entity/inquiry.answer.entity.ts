import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { UUID } from '@common/type';
import { Inquiry } from './inquiry.entity';

@Entity({ name: 'inquiry_answer' })
export class InquiryAnswer extends CommonBaseEntity {
  @Column({ name: 'inquiry_id', nullable: false, type: 'uuid' })
  @Index()
  inquiryId: UUID;

  @Column({ type: String })
  content: string;

  @OneToOne(() => Inquiry, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'inquiry_id' })
  inquiry: Inquiry;

  static of(createRequest: {
    inquiryId: UUID;
    content: string;
  }): InquiryAnswer {
    const answer = new InquiryAnswer();
    answer.inquiryId = createRequest.inquiryId;
    answer.content = createRequest.content;
    return answer;
  }

  update(updateRequest: { content: string }): InquiryAnswer {
    this.content = updateRequest.content ?? this.content;
    return this;
  }
}
