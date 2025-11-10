import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CommonBaseEntity } from '@common/entity';
import { User } from 'src/module/user/entity/user.entity';
import { CreateUserAuthTokenDto } from '../dto/auth.dto';

@Entity({ name: 'user_auth_token' })
export class UserAuthToken extends CommonBaseEntity {
  @Column({ name: 'user_id', type: String })
  userId: string;

  @Column({
    default: null,
    nullable: true,
    name: 'used_at',
  })
  usedAt: Date | null;

  @Column({ type: String })
  access: string;

  @Column({ type: String })
  refresh: string;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  static of(createDto: CreateUserAuthTokenDto): UserAuthToken {
    const userAuthToken = new UserAuthToken();

    userAuthToken.userId = createDto.userId;
    userAuthToken.access = createDto.accessToken;
    userAuthToken.refresh = createDto.refreshToken;

    return userAuthToken;
  }

  use(): UserAuthToken {
    this.usedAt = new Date();
    return this;
  }
}
