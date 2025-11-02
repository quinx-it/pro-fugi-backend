import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthCustomerRolesService } from '@/modules/auth/submodules/roles/submodules/customers/auth-customer-roles.service';
import { CustomerRoleEntity } from '@/modules/auth/submodules/roles/submodules/customers/entities/customer-role.entity';
import { CustomerUserAuthGuard } from '@/modules/auth/submodules/roles/submodules/customers/guards/customer-user.auth-guard';
import { CustomerRolesRepository } from '@/modules/auth/submodules/roles/submodules/customers/repositories/customer-roles.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerRoleEntity])],
  providers: [
    AuthCustomerRolesService,
    CustomerRolesRepository,
    CustomerUserAuthGuard,
  ],
  exports: [AuthCustomerRolesService],
})
export class AuthCustomerRolesModule {}
