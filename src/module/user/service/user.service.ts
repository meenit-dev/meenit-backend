import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { SignUpRequestDto } from '../../auth/dto/auth.dto';
import { User } from '../entity/user.entity';
import { PatchUserInfoBodyDto, PutUserAccountBodyDto } from '../dto/user.dto';
import { SsoProvider, UserPayload } from 'src/module/auth/type/auth.type';
import { DuplicatedError, NotFoundError } from '@common/error';
import { UserProfileRepository } from '../repository/user.profile.repository';
import { UserProfile } from '../entity/user.profile.entity';
import { Transactional } from 'typeorm-transactional';
import { UUID } from '@common/type';
import { AccountRepository } from '../repository/account.repository';
import { Account } from '../entity/account.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  async getUserById(id: string) {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundError();
    }
    return user;
  }

  async getUserWithProfileById(id: string) {
    const user = await this.userRepository.findOneWithProfileById(id);
    if (!user) {
      throw new NotFoundError();
    }
    return user;
  }

  async getUserByHandle(handle: string) {
    const user = await this.userRepository.findOneByHandle(handle);
    if (!user) {
      throw new NotFoundError();
    }
    return user;
  }

  async getUserWithProfileByHandle(handle: string) {
    const user = await this.userRepository.findOneWithProfileByHandle(handle);
    if (!user) {
      throw new NotFoundError();
    }
    return user;
  }

  async getUserByProviderAndProviderId(
    provider: SsoProvider,
    providerId: string,
  ) {
    return this.userRepository.findOneByProviderAndProviderId(
      provider,
      providerId,
    );
  }

  async createUser(signUpRequest: SignUpRequestDto) {
    const user = await this.userRepository.save(User.of(signUpRequest));
    await this.userProfileRepository.save(UserProfile.of(user.id));
    return user;
  }

  @Transactional()
  async updateUserInfo(
    { id }: UserPayload,
    updateRequest: PatchUserInfoBodyDto,
  ) {
    const user = await this.getUserById(id);
    if (updateRequest.handle) {
      if (await this.userRepository.findOneByHandle(updateRequest.handle)) {
        throw new DuplicatedError();
      }
    }
    await this.userRepository.save(user.update(updateRequest));
    const userProfile = await this.userProfileRepository.findOneByUserId(
      user.id,
    );
    await this.userProfileRepository.save(userProfile.update(updateRequest));
  }

  async updateUserPhone(userId: UUID, phone: string) {
    const user = await this.getUserById(userId);
    await this.userRepository.save(user.updatePhone(phone));
  }

  @Transactional()
  async updateUserAccount(userId: UUID, updateAccount: PutUserAccountBodyDto) {
    const user = await this.getUserById(userId);
    const account = await this.accountRepository.findOneByUserId(user.id);
    if (!account) {
      await this.userRepository.save(user.toCreator());
      await this.accountRepository.save(
        Account.of({ ...updateAccount, userId }),
      );
    } else {
      await this.accountRepository.save(account.update(updateAccount));
    }
  }

  async getUserAccountByUserId(userId: UUID) {
    const account = await this.accountRepository.findOneByUserId(userId);
    if (!account) {
      throw new NotFoundError();
    }
    return account;
  }
}
