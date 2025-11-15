import {
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AuthPhoneMethodEntity } from '@/modules/auth/submodules/methods/submodules/phone/entities/auth-phone-method.entity';
import { AuthAdminRoleEntity } from '@/modules/auth/submodules/roles/submodules/admins/entities/auth-admin-role.entity';
import { AuthCustomerRoleEntity } from '@/modules/auth/submodules/roles/submodules/customers/entities/auth-customer-role.entity';
import { IAuthUser } from '@/modules/auth/submodules/users/types';
import { DbType, DbUtil } from '@/shared';

@Entity()
export class AuthUserEntity implements IAuthUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ type: DbType.TIMESTAMP_TZ })
  createdAt!: Date;

  @OneToMany(
    () => AuthPhoneMethodEntity,
    (authPhoneMethod) => authPhoneMethod.authUser,
  )
  authPhoneMethods?: AuthPhoneMethodEntity[];

  @OneToOne(
    () => AuthCustomerRoleEntity,
    (customerRole) => customerRole.authUser,
  )
  authCustomerRole?: AuthCustomerRoleEntity | null;

  @OneToOne(() => AuthAdminRoleEntity, (adminRole) => adminRole.authUser)
  authAdminRole?: AuthAdminRoleEntity | null;

  get phone(): string | null {
    const authPhoneMethods = DbUtil.getRelatedEntityOrThrow<
      AuthUserEntity,
      AuthPhoneMethodEntity[]
    >(this, 'authPhoneMethods');

    if (!authPhoneMethods.length) {
      return null;
    }

    const latestAuthPhoneMethod = authPhoneMethods.reduce((latest, current) =>
      current.createdAt > latest.createdAt ? current : latest,
    );

    return latestAuthPhoneMethod ? latestAuthPhoneMethod.phone : null;
  }
}
