import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { IAuthAdminRole } from '@/modules/auth/submodules/roles/submodules/admins/types';
import { AuthUserEntity } from '@/modules/auth/submodules/users/entities';
import { DbType } from '@/shared';

@Entity()
export class AuthAdminRoleEntity implements IAuthAdminRole {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column(DbType.VARCHAR)
  name!: string;

  @CreateDateColumn({ type: DbType.TIMESTAMP_TZ })
  createdAt!: Date;

  @OneToOne(() => AuthUserEntity, (user) => user.authAdminRole)
  @JoinColumn()
  authUser?: AuthUserEntity;

  @Column(DbType.INTEGER)
  authUserId!: number;
}
