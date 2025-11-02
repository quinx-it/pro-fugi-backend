import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Request } from 'express';

import { BEARER_PREFIX } from '@/modules/auth/submodules/tokens/constants';
import { AuthAccessTokensService } from '@/modules/auth/submodules/tokens/services';
import { UserTokenPayloadDto } from '@/modules/auth/submodules/users/dtos/user-token-payload.dto';
import { ERROR_MESSAGES, GLOBAL_VALIDATION_PIPE_OPTIONS } from '@/shared';

@Injectable()
export class AccessTokenAuthGuard implements CanActivate {
  constructor(private authBearerAccessService: AuthAccessTokensService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const header = request.headers.authorization;
    const token = header
      ? AccessTokenAuthGuard.extractFromHeader(header)
      : null;

    if (!token) {
      throw new UnauthorizedException();
    }

    const payload = await this.authBearerAccessService.validateOne(
      token,
      false,
    );

    if (!payload) {
      throw new UnauthorizedException(
        ERROR_MESSAGES.AUTH_TOKENS_INVALID_OR_EXPIRED,
      );
    }

    const payloadDto = plainToInstance(UserTokenPayloadDto, payload);

    await validateOrReject(payloadDto, GLOBAL_VALIDATION_PIPE_OPTIONS);

    request.user = payload;

    return true;
  }

  private static extractFromHeader(header: string): string | null {
    const [bearerPrefix, token] = header.split(' ') ?? [];

    return bearerPrefix === BEARER_PREFIX ? token : null;
  }
}
