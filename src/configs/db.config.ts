import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

import {
  DB_HOST_NAME,
  DB_NAME,
  DB_PASSWORD,
  DB_USERNAME,
  DB_HOST_PORT,
} from '@/configs/env';
import { AuthPhoneMethodEntity } from '@/modules/auth/submodules/methods/submodules/phone/entities/auth-phone-method.entity';
import { AuthAdminRoleEntity } from '@/modules/auth/submodules/roles/submodules/admins/entities/auth-admin-role.entity';
import { AuthCustomerRoleAddressEntity } from '@/modules/auth/submodules/roles/submodules/customers/entities';
import { AuthCustomerRoleEntity } from '@/modules/auth/submodules/roles/submodules/customers/entities/auth-customer-role.entity';
import {
  AuthUserEntity,
  AuthUsersSearchViewEntity,
} from '@/modules/auth/submodules/users/entities';
import { NewsArticleEntity } from '@/modules/news/entities';
import { PartnershipLetterEntity } from '@/modules/partnership/entities';
import { ProductImageEntity } from '@/modules/products/submodules/items/entities/product-image.entity';
import {
  ProductOrderEntity,
  ProductOrderItemEntity,
  ProductOrdersSearchViewEntity,
} from '@/modules/products/submodules/orders/entities';
import { ProductOrderAddressEntity } from '@/modules/products/submodules/orders/entities/product-order-address.entity';
import {
  ProductCategoryEntity,
  ProductItemEntity,
  ProductReviewEntity,
  ProductItemSearchViewEntity,
} from '@/modules/products/submodules/reviews/entities';
import { ProductReviewImageEntity } from '@/modules/products/submodules/reviews/entities/product-review-image.entity';
import { DbEngine, MIGRATIONS_PATH } from '@/shared/constants/db.constants';
import { DbNamingStrategy } from '@/shared/utils/db-naming-strategy';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: DbEngine.POSTGRES,
  host: DB_HOST_NAME,
  port: DB_HOST_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [
    AuthPhoneMethodEntity,
    AuthUserEntity,
    AuthUsersSearchViewEntity,
    AuthCustomerRoleEntity,
    AuthCustomerRoleAddressEntity,
    AuthAdminRoleEntity,
    ProductItemEntity,
    ProductReviewEntity,
    ProductItemSearchViewEntity,
    ProductCategoryEntity,
    ProductImageEntity,
    ProductReviewImageEntity,
    ProductOrderEntity,
    ProductOrderItemEntity,
    ProductOrdersSearchViewEntity,
    ProductOrderAddressEntity,
    NewsArticleEntity,
    PartnershipLetterEntity,
  ],
  migrations: [MIGRATIONS_PATH],
  synchronize: false,
  namingStrategy: new DbNamingStrategy(),
  logNotifications: true,
};

const dataSource = new DataSource(typeOrmConfig as DataSourceOptions);

export default dataSource;
