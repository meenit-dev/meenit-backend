import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entity/admin.entity';
import { AdminService } from './service/admin.service';
import { AdminRepository } from './repository/admin.repository';
import { AdminController } from './controller/admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  providers: [AdminService, AdminRepository],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
