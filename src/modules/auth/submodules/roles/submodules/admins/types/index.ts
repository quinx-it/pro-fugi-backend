import { IAuthUser } from '@/modules/auth/submodules/users/types';

export interface IAuthAdminRole {
  id: number;
  createdAt: Date;
  name: string;

  authUserId: number;
  authUser?: IAuthUser;
}

export interface ICreateAuthAdminRole {
  name: string;
}

export interface IUpdateAuthAdminRole {
  name?: string;
}
