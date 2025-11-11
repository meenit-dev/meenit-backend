import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity } from 'typeorm';
import { SignUpRequestDto } from '../../auth/dto/auth.dto';
import { PutUserInfoBodyDto } from '../dto/user.dto';

@Entity({ name: 'user' })
export class User extends CommonBaseEntity {
  @Column({ nullable: false, type: String })
  name: string;

  @Column({ nullable: false, type: String })
  email: string;

  @Column({ nullable: true, type: String })
  avatar: string | null;

  @Column({ name: 'google_id', nullable: true, type: String })
  googleId: string | null;

  @Column({ name: 'x_id', nullable: true, type: String })
  xId: string | null;

  static of(createRequest: SignUpRequestDto): User {
    const user = new User();
    user.name = createRequest.name;
    user.email = createRequest.email;

    return user;
  }

  update(update: PutUserInfoBodyDto): User {
    this.name = update.name || this.name;
    this.avatar = update.avatar;

    return this;
  }
}
