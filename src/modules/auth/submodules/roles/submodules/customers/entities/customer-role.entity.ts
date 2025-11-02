import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ICustomerRole } from '@/modules/auth/submodules/roles/submodules/customers/types';
import { UserEntity } from '@/modules/auth/submodules/users/entities';
import { DbType } from '@/shared';

@Entity()
export class CustomerRoleEntity implements ICustomerRole {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column(DbType.VARCHAR, { nullable: true })
  name!: string | null;

  @CreateDateColumn({ type: DbType.TIMESTAMP_TZ })
  createdAt!: Date;

  @OneToOne(() => UserEntity, (user) => user.customerRole)
  @JoinColumn()
  user!: UserEntity;

  @Column(DbType.INTEGER)
  userId!: number;
}
