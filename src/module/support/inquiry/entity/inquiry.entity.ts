import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { InquiryCategory } from '../type/inquiry.type';
import { UUID } from '@common/type';
import { User } from 'src/module/user/entity/user.entity';
import { InquiryAnswer } from './inquiry.answer.entity';

@Entity({ name: 'inquiry' })
export class Inquiry extends CommonBaseEntity {
  @Column({ name: 'user_id', nullable: false, type: 'uuid' })
  @Index()
  userId: UUID;

  @Column({ type: String })
  title: string;

  @Column({ type: String })
  content: string;

  @Column({ type: String })
  category: InquiryCategory;

  @Column({
    default: null,
    nullable: true,
    name: 'answered_at',
  })
  answeredAt: Date | null;

  @ManyToOne(() => User, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => InquiryAnswer, (answer) => answer.inquiry)
  answer: InquiryAnswer;

  static of(createRequest: {
    userId: UUID;
    title: string;
    content: string;
    category: InquiryCategory;
  }): Inquiry {
    const inquiry = new Inquiry();
    inquiry.userId = createRequest.userId;
    inquiry.title = createRequest.title;
    inquiry.content = createRequest.content;
    inquiry.category = createRequest.category;
    return inquiry;
  }

  updateAnsweredAt(answeredAt?: Date): Inquiry {
    this.answeredAt = answeredAt ?? new Date();
    return this;
  }
}
