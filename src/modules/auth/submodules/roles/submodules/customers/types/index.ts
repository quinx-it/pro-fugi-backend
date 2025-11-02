import { ICreatable, IIdentifiable } from '@/shared';

export interface ICustomerRole extends IIdentifiable, ICreatable {
  name: string | null;
}
