import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { BeforeInsert, Column, Entity, Index } from 'typeorm';
import * as crypto from 'crypto';
import { encryptSha512 } from '@common/util';
import { InternalServerError } from '@common/error';

@Entity({ name: 'admin' })
export class Admin extends CommonBaseEntity {
  @Column({ type: String })
  name: string;

  @Column({ type: String })
  @Index({ unique: true })
  email: string;

  @Column({ type: String })
  password: string;

  @Column({ type: String })
  salt: string;

  static of(createRequest: {
    name: string;
    email: string;
    password: string;
  }): Admin {
    const admin = new Admin();
    admin.name = createRequest.name;
    admin.email = createRequest.email;
    admin.password = createRequest.password;
    return admin;
  }

  updatePassword(password: string) {
    this.password = password;
    this.encryptPassword();
    return this;
  }

  @BeforeInsert()
  encryptPassword(): void {
    try {
      this.salt = crypto.randomBytes(64).toString('base64');
      this.password = encryptSha512(this.password, this.salt);
    } catch (error) {
      throw new InternalServerError();
    }
  }
}
