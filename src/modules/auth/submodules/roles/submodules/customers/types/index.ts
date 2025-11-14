import { IAuthUser } from '@/modules/auth/submodules/users/types';
import { IProductOrder } from '@/modules/products/submodules/orders/types';

export interface IAuthCustomerRole {
  id: number;
  firstName: string | null;
  lastName: string | null;
  address: string | null;
  phone?: string | null;
  productOrders?: IProductOrder[];
  authUserId: number;
  authUser?: IAuthUser;
  createdAt: Date;
}

export interface ICreateAuthCustomerRole {
  firstName: string | null;
  lastName: string | null;
  address: string | null;
}

export interface IUpdateAuthCustomerRole {
  firstName?: string | null;
  lastName?: string | null;
  address?: string | null;
}
