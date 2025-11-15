import { IAuthPhoneMethodData } from '@/modules/auth/submodules/methods/submodules/phone/types';
import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import { IAuthRefreshData } from '@/modules/auth/types';

export interface IAuthTokens {
  access: string;
  refresh: string;
}

export interface IPayload<T> {
  data: T;
}

export type ICreateAuthRefreshTokenByPhone = IAuthPhoneMethodData;
export interface ICreateAuthAccessTokenByRefresh extends IAuthRefreshData {
  authRole?: AuthRole;
}
