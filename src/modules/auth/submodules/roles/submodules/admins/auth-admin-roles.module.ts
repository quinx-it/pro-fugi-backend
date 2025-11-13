import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthAdminRolesService } from '@/modules/auth/submodules/roles/submodules/admins/auth-admin-roles.service';
import { AuthAdminRoleEntity } from '@/modules/auth/submodules/roles/submodules/admins/entities/auth-admin-role.entity';
import { AdminRoleAuthGuard } from '@/modules/auth/submodules/roles/submodules/admins/guards/admin-role-auth.guard';
import { AdminUsersRepository } from '@/modules/auth/submodules/roles/submodules/admins/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([AuthAdminRoleEntity])],
  providers: [AdminUsersRepository, AuthAdminRolesService, AdminRoleAuthGuard],
  exports: [AuthAdminRolesService],
})
export class AuthAdminRolesModule {}
