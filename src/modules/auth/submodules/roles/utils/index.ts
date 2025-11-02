import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import { IUser } from '@/modules/auth/submodules/users/types';

export class AuthRolesUtil {
  static getRoles(user: IUser): AuthRole[] {
    const roles: AuthRole[] = [];

    const { adminRole, customerRole } = user;

    if (adminRole) {
      roles.push(AuthRole.ADMIN);
    }

    if (customerRole) {
      roles.push(AuthRole.CUSTOMER);
    }

    return roles;
  }
}
