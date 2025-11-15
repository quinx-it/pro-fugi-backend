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

    const { authRoles } = user as IAuthPayload;

    const { authRole } = this;

    if (!authRoles.includes(authRole)) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.AUTH_ROLE_REQUIRED_TEMPLATE,
        { authRole },
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
