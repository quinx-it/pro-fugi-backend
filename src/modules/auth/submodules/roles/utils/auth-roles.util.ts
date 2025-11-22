import { HttpStatus } from '@nestjs/common';

import {
  AuthRole,
  AUTH_ROLE_ENTITY_KEY_MAP,
  AUTH_ROLES_PRIORITY_DESCENDING,
} from '@/modules/auth/submodules/roles/constants';
import { IAuthPayload, IAuthUser } from '@/modules/auth/submodules/users/types';
import { AppException, ERROR_MESSAGES } from '@/shared';

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
    authUser: IAuthUser,
    authRole?: AuthRole,
  ): IAuthPayload {
    const { id: authUserId } = authUser;
    const authRoleOfHighestPriority = AuthRolesUtil.findOneOfHighestPriority(
      AuthRolesUtil.getRoles(authUser),
    );

    const authRoleToAccess = authRole || authRoleOfHighestPriority;

    const authRoles = authRoleToAccess ? [authRoleToAccess] : [];

    if (authRoleToAccess) {
      const roleKey = AUTH_ROLE_ENTITY_KEY_MAP[authRoleToAccess];
      const roleEntity = authUser[roleKey];

      const roleId =
        typeof roleEntity === 'object' &&
        roleEntity !== null &&
        'id' in roleEntity
          ? (roleEntity.id as number)
          : undefined;

      if (!authRoles.includes(authRoleToAccess) || !roleId) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.AUTH_ROLE_REQUIRED_TEMPLATE,
          { authRole: authRoleToAccess },
          HttpStatus.BAD_REQUEST,
        );
      }

      const BASE: IAuthPayload = {
        authUserId: authUser.id,
        authRoles,
        authCustomerRoleId: null,
        authAdminRoleId: null,
      };

      return { ...BASE, [`${roleKey}Id`]: roleId };
    }

    return {
      authUserId,
      authRoles,
      authCustomerRoleId: null,
      authAdminRoleId: null,
    };
  }

  private static findOneOfHighestPriority(
    roles: AuthRole[],
  ): AuthRole | undefined {
    const rolesByPriority = AUTH_ROLES_PRIORITY_DESCENDING.map(
      (authRoleOfPriority) =>
        roles.includes(authRoleOfPriority) ? authRoleOfPriority : undefined,
    ).filter((role) => role !== undefined);

    const [roleOfHighestPriority] = rolesByPriority;

    return roleOfHighestPriority;
  }
}
