import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AuthCustomerRoleEntity } from '@/modules/auth/submodules/roles/submodules/customers/entities/auth-customer-role.entity';
import { IAuthCustomerRoleAddress } from '@/modules/auth/submodules/roles/submodules/customers/types';
import { DbType } from '@/shared';

@Entity()
export class AuthCustomerRoleAddressEntity implements IAuthCustomerRoleAddress {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column(DbType.VARCHAR)
  city!: string;

  @Column(DbType.VARCHAR)
  street!: string;

  @Column(DbType.VARCHAR)
  building!: string;

  @Column(DbType.VARCHAR, { nullable: true })
  block!: string | null;

  @Column(DbType.VARCHAR, { nullable: true })
  apartment!: string | null;

  @OneToOne(
    () => AuthCustomerRoleEntity,
    (authCustomerRole) => authCustomerRole.address,
  )
  @JoinColumn()
  authCustomerRole?: AuthCustomerRoleEntity;

  @Column(DbType.INTEGER)
  authCustomerRoleId!: number;
}
