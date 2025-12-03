import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { UUID } from '@common/type';

@Entity({ name: 'follow' })
export class Follow extends CommonBaseEntity {
  @Column({ name: 'user_id', nullable: false, type: String })
  @Index()
  userId: UUID;

  @Column({ name: 'follow_user_id', nullable: false, type: String })
  @Index()
  followUserId: UUID;

  @ManyToOne(() => User, (user) => user.followers, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, (user) => user.following, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'follow_user_id' })
  followUser: User;

  static of(userId: UUID, followUserId: UUID): Follow {
    const follow = new Follow();
    follow.userId = userId;
    follow.followUserId = followUserId;
    return follow;
  }
}
