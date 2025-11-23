import { ViewColumn, ViewEntity } from 'typeorm';

import { AUTH_USERS_SEARCH_VIEW_SQL_NAME } from '@/modules/auth/constants';
import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import { IAuthUsersSearchView } from '@/modules/auth/submodules/users/types';

@ViewEntity({ name: AUTH_USERS_SEARCH_VIEW_SQL_NAME, synchronize: false })
export class AuthUsersSearchViewEntity implements IAuthUsersSearchView {
  @ViewColumn()
  adminName!: string | null;

  @ViewColumn()
  createdAt!: Date;

  @ViewColumn()
  customerAddress!: string | null;

  @ViewColumn()
  customerFullName!: string | null;

  @ViewColumn()
  id!: number;

  @ViewColumn()
  phone!: string | null;

  @ViewColumn()
  roles!: AuthRole[];
}
