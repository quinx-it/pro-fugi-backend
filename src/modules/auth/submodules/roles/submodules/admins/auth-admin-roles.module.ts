import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthTokensModule } from '@/modules/auth/submodules';
import { AuthAdminRolesController } from '@/modules/auth/submodules/roles/submodules/admins/auth-admin-roles.controller';
import { AuthAdminRolesService } from '@/modules/auth/submodules/roles/submodules/admins/auth-admin-roles.service';
import { AuthAdminRoleEntity } from '@/modules/auth/submodules/roles/submodules/admins/entities/auth-admin-role.entity';
import { AdminRoleAuthGuard } from '@/modules/auth/submodules/roles/submodules/admins/guards/admin-role-auth.guard';
import { AuthAdminRolesRepository } from '@/modules/auth/submodules/roles/submodules/admins/repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthAdminRoleEntity]),
    forwardRef(() => AuthTokensModule),
  ],
  providers: [
    AuthAdminRolesRepository,
    AuthAdminRolesService,
    AdminRoleAuthGuard,
  ],
  controllers: [AuthAdminRolesController],
  exports: [AuthAdminRolesService],
})
export class AuthAdminRolesModule {}
