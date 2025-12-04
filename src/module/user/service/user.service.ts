import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { SignUpRequestDto } from '../../auth/dto/auth.dto';
import { User } from '../entity/user.entity';
import {
  GetFollowUserQueryDto,
  GetMyUserProfileResponseDto,
  PatchCreatorSettingBodyDto,
  PatchUserInfoBodyDto,
  PutUserAccountBodyDto,
} from '../dto/user.dto';
import { SsoProvider, UserPayload } from 'src/module/auth/type/auth.type';
import {
  BadRequestError,
  DuplicatedError,
  ForbiddenError,
  NotFoundError,
} from '@common/error';
import { UserProfileRepository } from '../repository/user.profile.repository';
import { UserProfile } from '../entity/user.profile.entity';
import { Transactional } from 'typeorm-transactional';
import { UUID } from '@common/type';
import { AccountRepository } from '../repository/account.repository';
import { Account } from '../entity/account.entity';
import { ResourceService } from 'src/module/storage/service/resource.service';
import { FindCreatorsPagination } from '../dto/user.query.dto';
import { CreatorSettingRepository } from '../repository/creator.setting.repository';
import { CreatorSetting } from '../entity/creator.setting.entity';
import { UserType } from '../type/user.type';
import { FollowRepository } from '../repository/follow.repository';
import { Follow } from '../entity/follow.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly accountRepository: AccountRepository,
    private readonly resourceService: ResourceService,
    private readonly creatorSettingRepository: CreatorSettingRepository,
    private readonly followRepository: FollowRepository,
  ) {}

  async getUserById(id: string) {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundError();
    }
    return user;
  }

  async getUserWithCreatorSettingById(id: string) {
    const user = await this.userRepository.findOneWithCreatorSettingById(id);
    if (!user) {
      throw new NotFoundError();
    }
    if (user.type !== UserType.CREATOR) {
      throw new ForbiddenError();
    }
    return user;
  }

  async updateCreatorSetting(
    id: UUID,
    updateRequest: PatchCreatorSettingBodyDto,
  ) {
    const user = await this.getUserById(id);
    if (user.type !== UserType.CREATOR) {
      throw new ForbiddenError();
    }
    const creatorSetting = await this.creatorSettingRepository.findOneByUserId(
      user.id,
    );
    await this.creatorSettingRepository.save(
      creatorSetting.update(updateRequest),
    );
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

  async getCreatorByHandle(handle: string) {
    const user =
      await this.userRepository.findOneWithCreatorSettingByHandle(handle);
    if (!user) {
      throw new NotFoundError();
    }
    return user;
  }

  async getCreatorPagination(query: FindCreatorsPagination) {
    return this.userRepository.findCreatorsTopPortfolios(query);
  }

  async getUserWithProfileByHandle(handle: string, requestUserId?: UUID) {
    const user = await this.getUserByHandle(handle);
    const follow = requestUserId
      ? !!(await this.followRepository.findOneByUserIdAndFollowUserId(
          requestUserId,
          user.id,
        ))
      : false;
    return new GetMyUserProfileResponseDto(
      await this.getUserWithProfileById(user.id),
      follow,
    );
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
      await this.creatorSettingRepository.save(CreatorSetting.of(userId));
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

  async followUser(userId: UUID, handle: string) {
    const followUser = await this.getUserByHandle(handle);
    if (followUser.id === userId) {
      throw new BadRequestError();
    }
    await this.followRepository.save(Follow.of(userId, followUser.id));
  }

  async unfollowUser(userId: UUID, handle: string) {
    const followUser = await this.getUserByHandle(handle);
    await this.followRepository.deleteByUserIdAndFollowUserId(
      userId,
      followUser.id,
    );
  }

  async getFollowUserByHandle(handle: string, query: GetFollowUserQueryDto) {
    const user = await this.getUserByHandle(handle);
    if (query.isFollowing) {
      const { list, totalCount } =
        await this.followRepository.findFollowingWithUserPaginationByUserId(
          user.id,
          query,
        );
      return { list: list.map(({ followUser }) => followUser), totalCount };
    } else {
      const { list, totalCount } =
        await this.followRepository.findFollowerWithUserPaginationByUserId(
          user.id,
          query,
        );
      return { list: list.map(({ user }) => user), totalCount };
    }
  }
}
