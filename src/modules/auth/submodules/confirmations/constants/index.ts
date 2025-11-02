import { Template } from '@/shared';

export enum ConfirmationCodeType {
  SIGN_UP = 'signUp',
  UPDATE = 'update',
}

export const CONFIRMATION_CODE_REDIS_KEY_TEMPLATE = new Template<{
  value: string;
}>(/* language=ejs */ 'auth:confirmation:codes:<%= value %>');
