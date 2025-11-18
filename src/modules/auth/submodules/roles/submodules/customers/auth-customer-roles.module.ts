import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthTokensModule } from '@/modules/auth/submodules';
import { AuthCustomerRolesController } from '@/modules/auth/submodules/roles/submodules/customers/auth-customer-roles.controller';
import { AuthCustomerRolesService } from '@/modules/auth/submodules/roles/submodules/customers/auth-customer-roles.service';
import { AuthCustomerRoleAddressEntity } from '@/modules/auth/submodules/roles/submodules/customers/entities';
import { AuthCustomerRoleEntity } from '@/modules/auth/submodules/roles/submodules/customers/entities/auth-customer-role.entity';
import { CustomerRoleAuthGuard } from '@/modules/auth/submodules/roles/submodules/customers/guards/customer-role.auth-guard';
import { AuthCustomerRoleAddressesRepository } from '@/modules/auth/submodules/roles/submodules/customers/repositories';
import { AuthCustomerRolesRepository } from '@/modules/auth/submodules/roles/submodules/customers/repositories/auth-customer-roles.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthCustomerRoleEntity,
      AuthCustomerRoleAddressEntity,
    ]),
    forwardRef(() => AuthTokensModule),
  ],
  providers: [
    AuthCustomerRolesService,
    AuthCustomerRolesRepository,
    AuthCustomerRoleAddressesRepository,
    CustomerRoleAuthGuard,
  ],
  controllers: [AuthCustomerRolesController],
  exports: [AuthCustomerRolesService],
})
export class AuthCustomerRolesModule {}
