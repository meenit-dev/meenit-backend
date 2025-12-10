import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity } from 'typeorm';
import { NoticeType } from '../type/notice.type';

@Entity({ name: 'notice' })
export class Notice extends CommonBaseEntity {
  @Column({ type: String })
  title: string;

  @Column({ type: String })
  content: string;

  @Column({ type: Boolean, default: false })
  pin: boolean;

  @Column({ type: String })
  type: NoticeType;

  static of(createRequest: {
    title: string;
    content: string;
    pin: boolean;
    type: NoticeType;
  }): Notice {
    const notice = new Notice();
    notice.title = createRequest.title;
    notice.content = createRequest.content;
    notice.pin = createRequest.pin;
    notice.type = createRequest.type;
    return notice;
  }

  update(updateRequest: {
    title: string;
    content: string;
    pin: boolean;
    type: NoticeType;
  }): Notice {
    this.title = updateRequest.title;
    this.content = updateRequest.content;
    this.pin = updateRequest.pin;
    this.type = updateRequest.type;
    return this;
  }
}
