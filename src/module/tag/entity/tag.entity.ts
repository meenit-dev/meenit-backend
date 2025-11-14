import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity({ name: 'tag' })
export class Tag extends CommonBaseEntity {
  @Column({ nullable: false, type: String })
  @Index({ unique: true })
  name: string;

  @Column({ nullable: false, type: Number })
  @Index()
  count: number;

  static of(name: string): Tag {
    const tag = new Tag();
    tag.name = name;
    tag.count = 0;
    return tag;
  }
}
