import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AuthMethodType } from '@/modules/auth/submodules/methods/constants';
import {
  IAuthPhoneMethodData,
  IAuthPhoneMethod,
} from '@/modules/auth/submodules/methods/submodules/phone/types';
import { AuthUserEntity } from '@/modules/auth/submodules/users/entities';
import { DbType } from '@/shared';

@Entity()
export class AuthPhoneMethodEntity implements IAuthPhoneMethod {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column(DbType.INTEGER)
  authUserId!: number;

  @ManyToOne(() => AuthUserEntity)
  authUser!: AuthUserEntity;

  @Column(DbType.VARCHAR)
  phone!: string;

  @Column(DbType.VARCHAR)
  password!: string;

  @CreateDateColumn({ type: DbType.TIMESTAMP_TZ })
  createdAt!: Date;

  get data(): IAuthPhoneMethodData {
    const { phone, password } = this;

    return { phone, password };
  }

  get type(): AuthMethodType.PHONE {
    return AuthMethodType.PHONE;
  }
}
