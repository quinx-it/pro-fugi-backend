import { IAuthPhoneMethod } from '@/modules/auth/submodules/methods/submodules/phone/types';
import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import { IAuthAdminRole } from '@/modules/auth/submodules/roles/submodules/admins/types';
import {
  IAuthCustomerRole,
  IUpdateAuthCustomerRole,
} from '@/modules/auth/submodules/roles/submodules/customers/types';

export interface IAuthUser {
  id: number;

  authAdminRole?: IAuthAdminRole | null;
  authCustomerRole?: IAuthCustomerRole | null;

  authPhoneMethods?: IAuthPhoneMethod[];
  phone?: string | null;

  createdAt: Date;
}

export interface IUpdateAuthUser {
  authCustomerRole?: IUpdateAuthCustomerRole;
}
export interface AuthPayloadOptions {
  isNullable: boolean;
}

export interface IAuthPayload {
  authUserId: number;
  authCustomerRoleId: number | null;
  authAdminRoleId: number | null;
  authRoles: AuthRole[];
}

export interface IAuthRolePayload {
  userId: number;
  roleId: number;
  role: AuthRole;
}

export interface IAuthAdminPayload {
  authUserId: number;
  authCustomerRoleId: null;
  authAdminRoleId: number;
  authRoles: AuthRole[];
}

export interface IAuthCustomerPayload {
  authUserId: number;
  authCustomerRoleId: number;
  authAdminRoleId: null;
  authRoles: AuthRole[];
}
