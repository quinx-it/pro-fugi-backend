import { Exclude } from 'class-transformer';

import { IAdminRole } from '@/modules/auth/submodules/roles/submodules/admins/types';

export class AdminRoleDto implements IAdminRole {
  @Exclude()
  id!: number;

  @Exclude()
  userId!: number;

  @Exclude()
  createdAt!: Date;
}
