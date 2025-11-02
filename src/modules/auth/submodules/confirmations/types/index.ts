import { IExpirable } from '@/shared';

export interface IConfirmationCodeEntity<TParams = unknown> extends IExpirable {
  subject: string;
  params: TParams;
  value: string;
}

export interface IConfirmationCodeParams {
  isNewUser: boolean;
}

export interface ICreatePhoneConfirmationCode extends IConfirmationCodeParams {
  phone: string;
}
