import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { UUID } from '@common/type';
import { UserProfileLink } from '../type/user.type';

@Entity({ name: 'user_profile' })
export class UserProfile extends CommonBaseEntity {
  @Column({ name: 'user_id', nullable: false, type: String })
  @Index()
  userId: UUID;

  @Column({ nullable: true, type: String })
  introduction?: string;

  @Column({ nullable: true, type: String })
  background?: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  links?: UserProfileLink[];

  @OneToOne(() => User, (user) => user.profile, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  static of(userId: UUID): UserProfile {
    const profile = new UserProfile();
    profile.userId = userId;
    return profile;
  }

  update(update: {
    introduction?: string;
    background?: string;
    links?: UserProfileLink[];
  }): UserProfile {
    this.introduction = update.introduction || this.introduction;
    this.background = update.background || this.background;
    this.links = update.links?.length
      ? update.links.map(({ name, url }) => ({ name, url }))
      : this.links;
    return this;
  }
}
