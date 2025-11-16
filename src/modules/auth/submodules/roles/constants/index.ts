import { IAuthUser } from '@/modules/auth/submodules/users/types';

export enum AuthRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export const AUTH_ROLE_ENTITY_KEY_MAP: Record<AuthRole, keyof IAuthUser> = {
  [AuthRole.ADMIN]: 'authAdminRole',
  [AuthRole.CUSTOMER]: 'authCustomerRole',
};

export const AUTH_ROLES_PRIORITY_DESCENDING = [
  AuthRole.ADMIN,
  AuthRole.CUSTOMER,
];
