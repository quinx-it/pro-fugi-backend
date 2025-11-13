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
  userId: number;
  customerRoleId: number | null;
  adminRoleId: number | null;
  roles: AuthRole[];
}

export interface IAuthAdminPayload {
  userId: number;
  customerRoleId: number | null;
  adminRoleId: number;
  roles: AuthRole[];
}

export interface IAuthCustomerPayload {
  userId: number;
  customerRoleId: number;
  adminRoleId: number | null;
  roles: AuthRole[];
}
