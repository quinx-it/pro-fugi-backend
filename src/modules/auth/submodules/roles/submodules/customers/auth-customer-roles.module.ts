import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthCustomerRolesService } from '@/modules/auth/submodules/roles/submodules/customers/auth-customer-roles.service';
import { AuthCustomerRoleEntity } from '@/modules/auth/submodules/roles/submodules/customers/entities/auth-customer-role.entity';
import { CustomerRoleAuthGuard } from '@/modules/auth/submodules/roles/submodules/customers/guards/customer-role.auth-guard';
import { AuthCustomerRolesRepository } from '@/modules/auth/submodules/roles/submodules/customers/repositories/auth-customer-roles.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AuthCustomerRoleEntity])],
  providers: [
    AuthCustomerRolesService,
    AuthCustomerRolesRepository,
    CustomerRoleAuthGuard,
  ],
  exports: [AuthCustomerRolesService],
})
export class AuthCustomerRolesModule {}
