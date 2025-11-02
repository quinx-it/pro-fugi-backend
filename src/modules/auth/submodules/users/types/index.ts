import { IAuthPhoneMethod } from '@/modules/auth/submodules/methods/submodules/phone/types';
import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import { IAdminRole } from '@/modules/auth/submodules/roles/submodules/admins/types';
import { ICustomerRole } from '@/modules/auth/submodules/roles/submodules/customers/types';
import { ICreatable, IIdentifiable } from '@/shared';

export interface IWithUserRoles {
  adminRole: IAdminRole | null;
  customerRole: ICustomerRole | null;
}

export interface IWithAuthMethods {
  authPhoneMethods: IAuthPhoneMethod[];
}

export interface IUser
  extends IWithUserRoles,
    IWithAuthMethods,
    IIdentifiable,
    ICreatable {}

export interface UIDOptions {
  isNullable: boolean;
}

export interface IUserTokenPayload {
  id: number;
  roles: AuthRole[];
}
