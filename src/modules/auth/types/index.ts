import { AuthMethodType } from '@/modules/auth/submodules/methods/constants';
import { IAuthPhoneMethodData } from '@/modules/auth/submodules/methods/submodules/phone/types';

export interface AuthDataTypes {
  [AuthMethodType.PHONE]: IAuthPhoneMethodData;
}

export interface IAuthRefreshData {
  refresh: string;
}

export type IUnknownAuthData = Partial<IAuthPhoneMethodData> &
  Partial<IAuthRefreshData>;
