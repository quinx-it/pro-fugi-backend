import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { UIDOptions } from '@/modules/auth/submodules/users/types';

export const UID = createParamDecorator(
  (
    // eslint-disable-next-line default-param-last
    data: UIDOptions = { isNullable: false },
    ctx: ExecutionContext,
  ): number | null => {
    const request = ctx.switchToHttp().getRequest();

    const { user } = request;

    const { isNullable } = data;

    if (!user) {
      if (isNullable) {
        return null;
      }

      throw new UnauthorizedException();
    }

    const { id: userId } = user;

    if (!userId) {
      if (isNullable) {
        return null;
      }

      throw new UnauthorizedException();
    }

    return userId;
  },
);
