import { Entity, Column, Index } from 'typeorm';
import { CommonBaseEntity } from '@common/entity';
import { SsoProvider } from '../type/auth.type';

@Entity({ name: 'sso_account' })
export class SsoAccount extends CommonBaseEntity {
  @Column({ type: String })
  provider: SsoProvider;

  @Column({ name: 'sso_id', type: String })
  @Index()
  ssoId: string;

  @Column({ type: String, nullable: true })
  avatar?: string;

  static of(createDto: {
    provider: SsoProvider;
    ssoId: string;
    avatar?: string;
  }): SsoAccount {
    const ssoAccount = new SsoAccount();
    ssoAccount.provider = createDto.provider;
    ssoAccount.ssoId = createDto.ssoId;
    ssoAccount.avatar = createDto.avatar;
    return ssoAccount;
  }
}
