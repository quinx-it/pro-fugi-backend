import { IUser } from '@/modules/auth/submodules/users/types';
import { AuthDataTypes } from '@/modules/auth/types';
import { ICreatable, IIdentifiable } from '@/shared';

export interface IAuthMethod<
  T extends keyof AuthDataTypes = keyof AuthDataTypes,
> extends IIdentifiable,
    ICreatable {
  user: IUser;
  userId: number;
  data: AuthDataTypes[T];
  type: T;
}
