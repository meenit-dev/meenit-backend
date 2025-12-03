import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserService } from './service/user.service';
import { UserRepository } from './repository/user.repository';
import { UserController } from './controller/user.controller';
import { UsersController } from './controller/users.controller';
import { Account } from './entity/account.entity';
import { UserProfileRepository } from './repository/user.profile.repository';
import { UserProfile } from './entity/user.profile.entity';
import { AccountRepository } from './repository/account.repository';
import { StorageModule } from '../storage/storage.module';
import { TagModule } from '../tag/tag.module';
import { CreatorSettingRepository } from './repository/creator.setting.repository';
import { CreatorSetting } from './entity/creator.setting.entity';
import { FollowRepository } from './repository/follow.repository';
import { Follow } from './entity/follow.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Account,
      UserProfile,
      CreatorSetting,
      Follow,
    ]),
    StorageModule,
    TagModule,
  ],
  providers: [
    UserService,
    UserRepository,
    AccountRepository,
    UserProfileRepository,
    CreatorSettingRepository,
    FollowRepository,
  ],
  controllers: [UserController, UsersController],
  exports: [UserService],
})
export class UserModule {}
