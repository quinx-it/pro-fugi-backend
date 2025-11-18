import { IAuthUser } from '@/modules/auth/submodules/users/types';
import { IProductOrder } from '@/modules/products/submodules/orders/types';
import { IAddress } from '@/shared';

export interface IAuthCustomerRole {
  id: number;
  firstName: string | null;
  lastName: string | null;
  // eslint-disable-next-line no-use-before-define
  address?: IAuthCustomerRoleAddress | null;
  phone?: string | null;
  productOrders?: IProductOrder[];
  authUserId: number;
  authUser?: IAuthUser;
  createdAt: Date;
}

export interface ICreateAuthCustomerRole {
  firstName: string | null;
  lastName: string | null;
  address: IAddress | null;
}

export interface IUpdateAuthCustomerRole {
  firstName?: string | null;
  lastName?: string | null;
  address?: IAddress | null;
}

export interface IAuthCustomerRoleAddress extends IAddress {
  id: number;

  authCustomerRole?: IAuthCustomerRole;
  authCustomerRoleId: number;
}
