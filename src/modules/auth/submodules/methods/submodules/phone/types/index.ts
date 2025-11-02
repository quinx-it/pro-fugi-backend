import { AuthMethodType } from '@/modules/auth/submodules/methods/constants';
import { IAuthMethod } from '@/modules/auth/submodules/methods/types';

export interface IAuthPhoneMethodData {
  phone: string;
  password: string;
}

export interface IAuthPhoneMethod
  extends IAuthMethod<AuthMethodType.PHONE>,
    IAuthPhoneMethodData {}

export interface ICreatePhoneMethod extends IAuthPhoneMethodData {
  confirmationCode: string;
  isNewUser: boolean;
}
