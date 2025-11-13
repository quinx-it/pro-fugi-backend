import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import {
  IAuthPayload,
  AuthPayloadOptions,
} from '@/modules/auth/submodules/users/types';

export const AuthPayload = createParamDecorator(
  (
    // eslint-disable-next-line default-param-last
    data: AuthPayloadOptions = { isNullable: false },
    ctx: ExecutionContext,
  ): IAuthPayload | null => {
    const request = ctx.switchToHttp().getRequest();

    const { user } = request;

    const { isNullable } = data;

    if (!user) {
      if (isNullable) {
        return null;
      }

      throw new UnauthorizedException();
    }

    return user;
  },
);
