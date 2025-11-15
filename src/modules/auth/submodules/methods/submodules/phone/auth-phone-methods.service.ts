import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { DataSource, EntityManager } from 'typeorm';

import { authConfig } from '@/configs';
import { AuthPhoneMethodsRepository } from '@/modules/auth/submodules/methods/submodules/phone/repositories/auth-phone-methods-repository.service';
import { IAuthPhoneMethod } from '@/modules/auth/submodules/methods/submodules/phone/types';
import { AppException, ERROR_MESSAGES } from '@/shared';

@Injectable()
export class AuthPhoneMethodsService {
  constructor(
    private readonly repo: AuthPhoneMethodsRepository,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async findLatestOneOfUser(
    authUserId: number,
    throwIfNotFound: boolean,
  ): Promise<IAuthPhoneMethod | null>;

  async findLatestOneOfUser(
    authUserId: number,
    throwIfNotFound: true,
  ): Promise<IAuthPhoneMethod>;

  async findLatestOneOfUser(
    authUserId: number,
    throwIfNotFound: boolean,
  ): Promise<IAuthPhoneMethod | null> {
    const authMethods = await this.repo.findMany(authUserId);

    if (authMethods.length === 0) {
      if (throwIfNotFound) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
          {
            value: 'Auth method',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return null;
    }

    const authMethod = authMethods.reduce((latest, current) =>
      current.createdAt > latest.createdAt ? current : latest,
    );

    return authMethod;
  }

  async findLatestOneOfPhone(
    phone: string,
    throwIfNotFound: boolean,
  ): Promise<IAuthPhoneMethod | null>;

  async findLatestOneOfPhone(
    phone: string,
    throwIfNotFound: true,
  ): Promise<IAuthPhoneMethod>;

  async findLatestOneOfPhone(
    phone: string,
    throwIfNotFound: boolean,
  ): Promise<IAuthPhoneMethod | null> {
    const authMethods = await this.repo.findMany(undefined, phone, undefined);

    if (authMethods.length === 0) {
      if (throwIfNotFound) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
          {
            value: 'Auth method',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return null;
    }

    const authMethod = authMethods.reduce((latest, current) =>
      current.createdAt > latest.createdAt ? current : latest,
    );

    return authMethod;
  }

  async createOne(
    userId: number,
    phone: string,
    password: string,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAuthPhoneMethod> {
    const { passwordSaltingRounds } = authConfig;

    const passwordHashed = await bcrypt.hash(password, passwordSaltingRounds);

    const authMethodsOfPhone = await this.repo.findMany(userId, phone, manager);

    await Promise.all(
      authMethodsOfPhone.map(async (authMethodOfPhone) => {
        const { password: previousPassword } = authMethodOfPhone;

        const isMatch = await bcrypt.compare(password, previousPassword);

        if (isMatch) {
          throw new AppException(
            ERROR_MESSAGES.AUTH_METHODS_PASSWORD_MUST_DIFFER,
            HttpStatus.BAD_REQUEST,
          );
        }
      }),
    );

    const authMethod = await this.repo.createOne(
      userId,
      phone,
      passwordHashed,
      manager,
    );

    return authMethod;
  }
}
