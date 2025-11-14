import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity, Index, OneToMany, OneToOne } from 'typeorm';
import { SignUpRequestDto } from '../../auth/dto/auth.dto';
import { PatchUserInfoBodyDto } from '../dto/user.dto';
import { UserType } from '../type/user.type';
import { Account } from './account.entity';
import { UserProfile } from './user.profile.entity';
import { generateSecureRandomId } from '@common/util';
import { Portfolio } from 'src/module/portfolio/entity/portfolio.entity';

@Entity({ name: 'user' })
export class User extends CommonBaseEntity {
  @Column({ nullable: false, type: String, default: UserType.USER })
  type: UserType;

  @Column({ nullable: false, type: String })
  name: string;

  @Column({ nullable: false, type: String })
  @Index({ unique: true })
  handle: string;

  @Column({ nullable: false, type: String })
  email: string;

  @Column({ nullable: true, type: String })
  avatar?: string | null;

  @Column({ nullable: true, type: String })
  phone?: string | null;

  @Column({ name: 'google_id', nullable: true, type: String })
  googleId: string | null;

  @Column({ name: 'x_id', nullable: true, type: String })
  xId: string | null;

  @OneToOne(() => Account, (account) => account.user)
  account: Account;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserProfile;

  static of(createRequest: SignUpRequestDto): User {
    const user = new User();
    user.name = createRequest.name;
    user.handle = generateSecureRandomId(10);
    user.email = createRequest.email;
    user.avatar = createRequest.avatar;
    user.googleId = createRequest.googleId;
    user.xId = createRequest.xId;

    return user;
  }

  update(update: PatchUserInfoBodyDto): User {
    this.name = update.name;
    this.avatar = update.avatar;
    this.handle = update.handle;
    return this;
  }

  updatePhone(phone: string): User {
    this.phone = phone;
    return this;
  }

  toCreator(): User {
    this.type = UserType.CREATOR;
    return this;
  }
}
