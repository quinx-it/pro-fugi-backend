import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AuthCustomerRoleAddressEntity } from '@/modules/auth/submodules/roles/submodules/customers/entities/auth-customer-role-address.entity';
import { IAuthCustomerRole } from '@/modules/auth/submodules/roles/submodules/customers/types';
import { AuthUserEntity } from '@/modules/auth/submodules/users/entities';
import { ProductOrderEntity } from '@/modules/products/submodules/orders/entities/product-order.entity';
import { DbType } from '@/shared';

@Entity()
export class AuthCustomerRoleEntity implements IAuthCustomerRole {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column(DbType.VARCHAR, { nullable: true })
  firstName!: string | null;

  @Column(DbType.VARCHAR, { nullable: true })
  lastName!: string | null;

  @CreateDateColumn({ type: DbType.TIMESTAMP_TZ })
  createdAt!: Date;

  @OneToOne(() => AuthUserEntity, (user) => user.authCustomerRole)
  @JoinColumn()
  authUser?: AuthUserEntity;

  @Column(DbType.INTEGER)
  authUserId!: number;

  @OneToMany(() => ProductOrderEntity, (order) => order.authCustomerRole)
  productOrders?: ProductOrderEntity[];

  @OneToOne(
    () => AuthCustomerRoleAddressEntity,
    (address) => address.authCustomerRole,
    { nullable: true },
  )
  address?: AuthCustomerRoleAddressEntity | null;
}
