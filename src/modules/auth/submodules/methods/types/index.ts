import { IAuthUser } from '@/modules/auth/submodules/users/types';
import { AuthDataTypes } from '@/modules/auth/types';

export interface IAuthMethod<
  T extends keyof AuthDataTypes = keyof AuthDataTypes,
> {
  id: number;
  authUser?: IAuthUser;
  authUserId: number;
  data: AuthDataTypes[T];
  type: T;
  createdAt: Date;
}
