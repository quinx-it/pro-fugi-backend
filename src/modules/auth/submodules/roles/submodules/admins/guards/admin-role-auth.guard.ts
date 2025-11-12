import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import { RoleAuthGuard } from '@/modules/auth/submodules/roles/guards';

export class AdminRoleAuthGuard extends RoleAuthGuard<AuthRole.ADMIN> {
  protected get authRole(): AuthRole.ADMIN {
    return AuthRole.ADMIN;
  }
}
