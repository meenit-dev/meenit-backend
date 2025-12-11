import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repository/admin.repository';
import { UUID } from '@common/type';
import { PostAdminBodyDto } from '../dto/admin.dto';
import { Admin } from '../entity/admin.entity';
import { NotFoundError } from '@common/error';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async getAdminById(id: UUID) {
    const admin = await this.adminRepository.findOneById(id);
    if (!admin) {
      throw new NotFoundError();
    }
    return admin;
  }

  async getAdminByEmail(email: string) {
    const admin = await this.adminRepository.findOneByEmail(email);
    if (!admin) {
      throw new NotFoundError();
    }
    return admin;
  }

  async createAdmin(createReqeust: PostAdminBodyDto) {
    return this.adminRepository.save(Admin.of(createReqeust));
  }

  async updateAdminPassword(id: UUID, password: string) {
    const admin = await this.getAdminById(id);
    return this.adminRepository.save(admin.updatePassword(password));
  }
}
