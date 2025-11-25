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
import { ResourceService } from 'src/module/storage/service/resource.service';
import { FindCreatorsPagination } from '../dto/user.query.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly accountRepository: AccountRepository,
    private readonly resourceService: ResourceService,
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

  async getCreatorPagination(query: FindCreatorsPagination) {
    return this.userRepository.findCreatorsTopPortfolios(query);
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
    if (updateRequest.handle && user.handle !== updateRequest.handle) {
      if (await this.userRepository.findOneByHandle(updateRequest.handle)) {
        throw new DuplicatedError();
      }
    }
    await this.userRepository.save(user.update(updateRequest));
    const userProfile = await this.userProfileRepository.findOneByUserId(
      user.id,
    );
    await this.userProfileRepository.save(userProfile.update(updateRequest));
    await this.updateUserProfileResource(user, userProfile, updateRequest);
  }

  async updateUserProfileResource(
    user: User,
    userProfile: UserProfile,
    updateRequest: PatchUserInfoBodyDto,
  ) {
    if (updateRequest.avatar) {
      await this.resourceService.deleteResourceByUrl(user.avatar);
    } else if (updateRequest.avatar === null) {
      await this.resourceService.deleteResourceByUrl(user.avatar);
    }
    if (updateRequest.background) {
      await this.resourceService.deleteResourceByUrl(userProfile.background);
    } else if (updateRequest.background === null) {
      await this.resourceService.deleteResourceByUrl(userProfile.background);
    }
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
