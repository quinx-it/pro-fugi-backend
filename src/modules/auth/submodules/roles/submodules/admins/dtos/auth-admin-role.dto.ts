import { Exclude } from 'class-transformer';

import { IAuthAdminRole } from '@/modules/auth/submodules/roles/submodules/admins/types';

export class AuthAdminRoleDto implements IAuthAdminRole {
  @Exclude()
  id!: number;

  @Exclude()
  userId!: number;

  @Exclude()
  createdAt!: Date;
}
