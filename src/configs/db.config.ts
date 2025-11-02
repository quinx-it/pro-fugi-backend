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
import { AdminRoleEntity } from '@/modules/auth/submodules/roles/submodules/admins/entities/admin-role.entity';
import { CustomerRoleEntity } from '@/modules/auth/submodules/roles/submodules/customers/entities/customer-role.entity';
import { UserEntity } from '@/modules/auth/submodules/users/entities';
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
    UserEntity,
    CustomerRoleEntity,
    AdminRoleEntity,
  ],
  migrations: [MIGRATIONS_PATH],
  synchronize: false,
  namingStrategy: new DbNamingStrategy(),
  logNotifications: true,
};

const dataSource = new DataSource(typeOrmConfig as DataSourceOptions);

export default dataSource;
