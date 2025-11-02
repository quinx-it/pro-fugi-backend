import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { IAdminRole } from '@/modules/auth/submodules/roles/submodules/admins/types';
import { UserEntity } from '@/modules/auth/submodules/users/entities';
import { DbType } from '@/shared';

@Entity()
export class AdminRoleEntity implements IAdminRole {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column(DbType.VARCHAR)
  name!: string;

  @CreateDateColumn({ type: DbType.TIMESTAMP_TZ })
  createdAt!: Date;

  @OneToOne(() => UserEntity, (user) => user.adminRole)
  @JoinColumn()
  user!: UserEntity;

  @Column(DbType.INTEGER)
  userId!: number;
}
