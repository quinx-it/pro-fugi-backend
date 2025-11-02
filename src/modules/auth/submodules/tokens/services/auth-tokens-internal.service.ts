import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class AuthTokensInternalService {
  constructor(private readonly jwtService: JwtService) {}

  async emitOne<TPayload extends object>(
    payload: TPayload,
    options: JwtSignOptions,
  ): Promise<string> {
    const token = this.jwtService.sign(payload, options);

    return token;
  }

  async validateOne<TPayload extends object>(
    token: string,
    options: JwtSignOptions,
    throwIfInvalid: false,
  ): Promise<TPayload | null>;

  async validateOne<TPayload extends object>(
    token: string,
    options: JwtSignOptions,
    throwIfInvalid: true,
  ): Promise<TPayload>;

  async validateOne<TPayload extends object>(
    token: string,
    options: JwtSignOptions,
    throwIfInvalid: boolean,
  ): Promise<TPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync<TPayload>(
        token,
        options,
      );

      return payload;
    } catch (error) {
      if (throwIfInvalid) {
        throw error;
      }
    }

    return null;
  }
}
