import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthAdminRolesService } from '@/modules/auth/submodules/roles/submodules/admins/auth-admin-roles.service';
import { AdminRoleEntity } from '@/modules/auth/submodules/roles/submodules/admins/entities/admin-role.entity';
import { AdminUserAuthGuard } from '@/modules/auth/submodules/roles/submodules/admins/guards/admin-user.auth-guard';
import { AdminUsersRepository } from '@/modules/auth/submodules/roles/submodules/admins/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([AdminRoleEntity])],
  providers: [AdminUsersRepository, AuthAdminRolesService, AdminUserAuthGuard],
  exports: [AuthAdminRolesService],
})
export class AuthAdminRolesModule {}
