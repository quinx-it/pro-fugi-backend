import { Module } from '@nestjs/common';

import { AuthAdminRolesModule } from '@/modules/auth/submodules/roles/submodules/admins';
import { AuthCustomerRolesModule } from '@/modules/auth/submodules/roles/submodules/customers/auth-customer-roles.module';

@Module({
  imports: [AuthAdminRolesModule, AuthCustomerRolesModule],
  exports: [AuthAdminRolesModule, AuthCustomerRolesModule],
})
export class AuthRolesModule {}
