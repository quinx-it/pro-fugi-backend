import { IAuthPhoneMethodData } from '@/modules/auth/submodules/methods/submodules/phone/types';
import { IAuthRefreshData } from '@/modules/auth/types';

export interface IAuthTokens {
  access: string;
  refresh: string;
}

export interface IPayload<T> {
  data: T;
}

export type ICreateAuthTokensByPhone = IAuthPhoneMethodData;
export type ICreateAuthTokensByRefresh = IAuthRefreshData;
