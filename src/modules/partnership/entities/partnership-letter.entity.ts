import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { IPartnershipLetter } from '@/modules/partnership/types';
import { DbType } from '@/shared';

@Entity()
export class PartnershipLetterEntity implements IPartnershipLetter {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column(DbType.VARCHAR)
  phone!: string;

  @Column(DbType.VARCHAR)
  text!: string;

  @Column(DbType.BOOLEAN)
  isRead!: boolean;

  @CreateDateColumn({ type: DbType.TIMESTAMP_TZ })
  createdAt!: Date;
}
