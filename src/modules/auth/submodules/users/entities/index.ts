import {
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AuthPhoneMethodEntity } from '@/modules/auth/submodules/methods/submodules/phone/entities/auth-phone-method.entity';
import { AdminRoleEntity } from '@/modules/auth/submodules/roles/submodules/admins/entities/admin-role.entity';
import { CustomerRoleEntity } from '@/modules/auth/submodules/roles/submodules/customers/entities/customer-role.entity';
import { IUser } from '@/modules/auth/submodules/users/types';
import { DbType } from '@/shared';

@Entity()
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ type: DbType.TIMESTAMP_TZ })
  createdAt!: Date;

  @OneToMany(
    () => AuthPhoneMethodEntity,
    (authPhoneMethod) => authPhoneMethod.user,
  )
  authPhoneMethods!: AuthPhoneMethodEntity[];

  @OneToOne(() => CustomerRoleEntity, (customerRole) => customerRole.user)
  customerRole!: CustomerRoleEntity | null;

  @OneToOne(() => AdminRoleEntity, (adminRole) => adminRole.user)
  adminRole!: AdminRoleEntity | null;
}
