import { Injectable } from '@nestjs/common';
import { JwtSignOptions } from '@nestjs/jwt';

import { AuthTokensInternalService } from '@/modules/auth/submodules/tokens/services/auth-tokens-internal.service';
import { IPayload } from '@/modules/auth/submodules/tokens/types';

@Injectable()
export abstract class AuthConfiguredTokenService {
  abstract get config(): JwtSignOptions;

  constructor(private readonly internalService: AuthTokensInternalService) {}

  async emitOne<TPayload extends object>(payload: TPayload): Promise<string> {
    const token = await this.internalService.emitOne(
      { data: payload },
      this.config,
    );

    return token;
  }

  async validateOne<TPayload extends object>(
    token: string,
    throwIfInvalid: true,
  ): Promise<TPayload>;

  async validateOne<TPayload extends object>(
    token: string,
    throwIfInvalid: false,
  ): Promise<TPayload | null>;

  async validateOne<TPayload extends object>(
    token: string,
    throwIfInvalid: boolean,
  ): Promise<TPayload | null> {
    const payload = throwIfInvalid
      ? await this.internalService.validateOne<IPayload<TPayload>>(
          token,
          this.config,
          true,
        )
      : await this.internalService.validateOne<IPayload<TPayload>>(
          token,
          this.config,
          false,
        );

    return payload ? payload.data : null;
  }
}
