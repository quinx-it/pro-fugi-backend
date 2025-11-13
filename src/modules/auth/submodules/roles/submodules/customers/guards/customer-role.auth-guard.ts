import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import { RoleAuthGuard } from '@/modules/auth/submodules/roles/guards';

export class CustomerRoleAuthGuard extends RoleAuthGuard<AuthRole.CUSTOMER> {
  protected get authRole(): AuthRole.CUSTOMER {
    return AuthRole.CUSTOMER;
  }
}
