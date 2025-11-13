import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import { IAuthPayload } from '@/modules/auth/submodules/users/types';
import { AppException, ERROR_MESSAGES } from '@/shared';

@Injectable()
export abstract class RoleAuthGuard<TAuthRole extends AuthRole>
  implements CanActivate
{
  protected abstract get authRole(): TAuthRole;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest<Request>();

    if (!user) {
      throw new UnauthorizedException();
    }

    const { roles } = user as IAuthPayload;

    const { authRole } = this;

    if (!roles.includes(authRole)) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.AUTH_USERS_ROLE_MISMATCH_TEMPLATE,
        { expectedRole: authRole, actualRoles: roles.toString() },
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
