import { Template } from '@/shared/utils/template';

export const WARNING_MESSAGES = {
  AUTH_PHONE_CONFIRMATION_CODE_DELIVERY_NOT_IMPLEMENTED_TEMPLATE: new Template<{
    value: string;
  }>(
    /* language=ejs */ 'Phone confirmation codes delivery is currently not implemented. A code, however, has been generated: <%= value %>',
  ),
};
