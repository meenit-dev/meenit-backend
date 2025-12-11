import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SwaggerApiTag } from '@common/type';
import { AdminService } from '../service/admin.service';
import { PostAdminBodyDto, UpdateAdminPasswordBodyDto } from '../dto/admin.dto';
import { ReqUser } from '@common/decorator';
import { AuthType, UserPayload } from 'src/module/auth/type/auth.type';
import { AuthAdminGuard } from 'src/module/auth/guard/auth.admin.guard';

@Controller({ path: 'admins', version: '1' })
@ApiTags(SwaggerApiTag.BACK_OFFICE, 'Admin')
@UseGuards(AuthAdminGuard)
@ApiSecurity(AuthType.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: 'Admin 생성' })
  async createAdmin(@Body() body: PostAdminBodyDto) {
    await this.adminService.createAdmin(body);
  }

  @Put('password')
  @ApiOperation({ summary: '패스워드 변경' })
  async updateAdminPassword(
    @ReqUser() user: UserPayload,
    @Body() body: UpdateAdminPasswordBodyDto,
  ) {
    return this.adminService.updateAdminPassword(user.id, body.password);
  }
}
