import { IAuthAdminRole } from '@/modules/auth/submodules/roles/submodules/admins/types';
import { IAuthCustomerRole } from '@/modules/auth/submodules/roles/submodules/customers/types';
import { AuthRolesUtil } from '@/modules/auth/submodules/roles/utils';
import { IAuthUser, IAuthPayload } from '@/modules/auth/submodules/users/types';
import { DbUtil } from '@/shared';

export class AuthUsersUtil {
  static getTokenPayload(user: IAuthUser): IAuthPayload {
    const { id } = user;

    const authCustomerRole = DbUtil.getRelatedEntityOrThrow<
      IAuthUser,
      IAuthCustomerRole
    >(user, 'authCustomerRole');

    const authAdminRole = DbUtil.getRelatedEntityOrThrow<
      IAuthUser,
      IAuthAdminRole
    >(user, 'authAdminRole');

    const { id: customerRoleId } = authCustomerRole || { id: null };
    const { id: adminRoleId } = authAdminRole || { id: null };

    const roles = AuthRolesUtil.getRoles(user);

    return {
      authUserId: id,
      authRoles: roles,
      authAdminRoleId: adminRoleId,
      authCustomerRoleId: customerRoleId,
    };
  }

  static toPlain(object: IAuthUser): IAuthUser {
    return {
      id: object.id,
      authAdminRole: object.authAdminRole,
      authCustomerRole: object.authCustomerRole,
      authPhoneMethods: object.authPhoneMethods,
      phone: object.phone,
      createdAt: object.createdAt,
    };
  }
}
