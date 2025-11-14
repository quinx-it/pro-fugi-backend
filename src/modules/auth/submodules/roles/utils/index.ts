import { HttpStatus } from '@nestjs/common';

import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import { IAuthPayload, IAuthUser } from '@/modules/auth/submodules/users/types';
import { AppException, ERROR_MESSAGES } from '@/shared';

const ROLE_ID_KEYS_MAP: Record<AuthRole, keyof IAuthUser> = {
  [AuthRole.ADMIN]: 'authAdminRole',
  [AuthRole.CUSTOMER]: 'authCustomerRole',
};

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

  static getTokenPayload(
    user: IAuthUser,
    authRole: AuthRole | null,
  ): IAuthPayload {
    if (authRole) {
      const roles = AuthRolesUtil.getRoles(user);

      const roleKey = ROLE_ID_KEYS_MAP[authRole];
      const roleEntity = user[roleKey];

      const roleId =
        typeof roleEntity === 'object' &&
        roleEntity !== null &&
        'id' in roleEntity
          ? (roleEntity.id as number)
          : undefined;

      if (!roles.includes(authRole) || !roleId) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.AUTH_ROLE_REQUIRED_TEMPLATE,
          { authRole },
          HttpStatus.BAD_REQUEST,
        );
      }

      const BASE: IAuthPayload = {
        authUserId: user.id,
        authRoles: [authRole],
        authCustomerRoleId: null,
        authAdminRoleId: null,
      };

      return { ...BASE, [`${roleKey}Id`]: roleId };
    }

    return {
      authUserId: user.id,
      authRoles: [],
      authCustomerRoleId: null,
      authAdminRoleId: null,
    };
  }
}
