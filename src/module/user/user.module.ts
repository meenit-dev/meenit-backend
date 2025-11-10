import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserService } from './service/user.service';
import { UserRepository } from './repository/user.repository';
import { UserController } from './controller/user.controller';
import { UsersController } from './controller/users.controller';
import { GroupUser } from './entity/group.user.view.entity';
import { GroupUserRepository } from './repository/group.user.repository';
import { GroupUsersController } from './controller/group.users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, GroupUser])],
  providers: [UserService, UserRepository, GroupUserRepository],
  controllers: [GroupUsersController, UserController, UsersController],
  exports: [UserService],
})
export class UserModule {}
