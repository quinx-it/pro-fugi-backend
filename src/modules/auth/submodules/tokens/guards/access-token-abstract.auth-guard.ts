import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Request } from 'express';

import { BEARER_PREFIX } from '@/modules/auth/submodules/tokens/constants';
import { AuthAccessTokensService } from '@/modules/auth/submodules/tokens/services';
import { UserTokenPayloadDto } from '@/modules/auth/submodules/users/dtos/user-token-payload.dto';
import { GLOBAL_VALIDATION_PIPE_OPTIONS } from '@/shared';

@Injectable()
export abstract class AccessTokenAbstractAuthGuard implements CanActivate {
  constructor(
    protected readonly authBearerAccessService: AuthAccessTokensService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const header = request.headers.authorization;
    const token = header
      ? AccessTokenAbstractAuthGuard.extractFromHeader(header)
      : null;

    if (!token) {
      return this.onTokenNotFound(request);
    }

    const payload = await this.authBearerAccessService.validateOne(
      token,
      false,
    );

    if (!payload) {
      return this.onTokenInvalid(request);
    }

    const payloadDto = plainToInstance(UserTokenPayloadDto, payload);

    await validateOrReject(payloadDto, GLOBAL_VALIDATION_PIPE_OPTIONS);

    request.user = payload;

    return true;
  }

  abstract onTokenNotFound(request: Request): boolean;

  abstract onTokenInvalid(request: Request): boolean;

  private static extractFromHeader(header: string): string | null {
    const [bearerPrefix, token] = header.split(' ') ?? [];

    return bearerPrefix === BEARER_PREFIX ? token : null;
  }
}
