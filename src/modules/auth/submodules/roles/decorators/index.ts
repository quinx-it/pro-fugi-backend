import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import {
  IAuthPayload,
  AuthPayloadOptions,
} from '@/modules/auth/submodules/users/types';

export const AuthRoles = createParamDecorator(
  (
    // eslint-disable-next-line default-param-last
    data: AuthPayloadOptions = { isNullable: false },
    ctx: ExecutionContext,
  ): AuthRole[] | null => {
    const request = ctx.switchToHttp().getRequest();

    const { user } = request;

    const { isNullable } = data;

    if (!user) {
      if (isNullable) {
        return null;
      }

      throw new UnauthorizedException();
    }

    const { authRoles } = user as IAuthPayload;

    return authRoles;
  },
);
