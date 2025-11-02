import { HttpStatus, Injectable } from '@nestjs/common';
import { isEqual } from 'lodash';

import { ConfirmationCodesRepository } from '@/modules/auth/submodules/confirmations/repositories/confirmation-codes.repository';
import { IConfirmationCodeEntity } from '@/modules/auth/submodules/confirmations/types';
import { AppException, ERROR_MESSAGES } from '@/shared';

@Injectable()
export abstract class ConfirmationCodesService {
  constructor(private readonly repo: ConfirmationCodesRepository) {}

  abstract getValue(subject: string): string;

  abstract getExpiresAt(subject: string): Date;

  async generateOne(
    subject: string,
    params: unknown,
  ): Promise<IConfirmationCodeEntity> {
    const value = this.getValue(subject);
    const expiresAt = this.getExpiresAt(subject);

    const code = await this.repo.createOne(subject, params, value, expiresAt);

    return code;
  }

  async findOne<TParams = unknown>(
    subject: string,
    value: string,
    throwIfInvalid: false,
  ): Promise<IConfirmationCodeEntity<TParams> | null>;

  async findOne<TParams = unknown>(
    subject: string,
    value: string,
    throwIfInvalid: true,
  ): Promise<IConfirmationCodeEntity<TParams>>;

  async findOne<TParams = unknown>(
    subject: string,
    value: string,
    throwIfInvalid: boolean,
  ): Promise<IConfirmationCodeEntity<TParams> | null> {
    const code = await this.repo.findOne<TParams>(subject, value, false);

    if (!code) {
      if (throwIfInvalid) {
        throw new AppException(
          ERROR_MESSAGES.AUTH_CONFIRMATION_CODES_INVALID_OR_EXPIRED,
          HttpStatus.BAD_REQUEST,
        );
      }

      return null;
    }

    const { expiresAt } = code;

    if (new Date(expiresAt).getTime() * 1000 <= new Date().getTime()) {
      if (throwIfInvalid) {
        throw new AppException(
          ERROR_MESSAGES.AUTH_CONFIRMATION_CODES_INVALID_OR_EXPIRED,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return code;
  }

  async validateOne(
    subject: string,
    params: unknown,
    value: string,
    throwIfInvalid: false,
  ): Promise<true>;

  async validateOne(
    subject: string,
    params: unknown,
    value: string,
    throwIfInvalid: true,
  ): Promise<true>;

  async validateOne(
    subject: string,
    expectedParams: unknown,
    value: string,
    throwIfInvalid: boolean,
  ): Promise<boolean> {
    const code = await this.findOne(subject, value, false);

    if (!code) {
      if (throwIfInvalid) {
        throw new AppException(
          ERROR_MESSAGES.AUTH_CONFIRMATION_CODES_INVALID_OR_EXPIRED,
          HttpStatus.BAD_REQUEST,
        );
      }

      return false;
    }

    const { params: actualParams } = code;

    if (!isEqual(expectedParams, actualParams)) {
      if (throwIfInvalid) {
        throw new AppException(
          ERROR_MESSAGES.AUTH_CONFIRMATION_CODES_INVALID_OR_EXPIRED,
          HttpStatus.BAD_REQUEST,
        );
      }

      return false;
    }

    return true;
  }

  async utilizeOne(
    subject: string,
    params: unknown,
    value: string,
  ): Promise<void> {
    await this.validateOne(subject, params, value, true);

    await this.repo.destroyOne(subject, value);
  }
}
