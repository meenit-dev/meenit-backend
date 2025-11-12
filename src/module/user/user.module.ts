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

@Module({
  imports: [TypeOrmModule.forFeature([User, Account, UserProfile])],
  providers: [
    UserService,
    UserRepository,
    AccountRepository,
    UserProfileRepository,
  ],
  controllers: [UserController, UsersController],
  exports: [UserService],
})
export class UserModule {}
