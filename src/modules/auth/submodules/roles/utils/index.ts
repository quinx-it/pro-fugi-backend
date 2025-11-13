import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import { IAuthUser } from '@/modules/auth/submodules/users/types';

export class AuthRolesUtil {
  static getRoles(user: IAuthUser): AuthRole[] {
    const roles: AuthRole[] = [];

    const { authAdminRole, authCustomerRole } = user;

    if (authAdminRole) {
      roles.push(AuthRole.ADMIN);
    }

    if (authCustomerRole) {
      roles.push(AuthRole.CUSTOMER);
    }

    return roles;
  }
}
