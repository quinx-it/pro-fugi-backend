import { Template } from '@/shared';

export const PRODUCT_FAVOURITES_REDIS_KEY_TEMPLATE = new Template<{
  authCustomerRoleId: string;
}>(/* language=ejs */ `customers:<%=authCustomerRoleId %>:favourites`);
