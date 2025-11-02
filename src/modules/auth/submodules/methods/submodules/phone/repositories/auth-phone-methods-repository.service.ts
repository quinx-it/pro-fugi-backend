import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { AuthPhoneMethodEntity } from '@/modules/auth/submodules/methods/submodules/phone/entities/auth-phone-method.entity';
import { IAuthPhoneMethod } from '@/modules/auth/submodules/methods/submodules/phone/types';
import { AppException, ERROR_MESSAGES } from '@/shared';

@Injectable()
export class AuthPhoneMethodsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findOne(
    id: number,
    throwIfNotFound: true,
    manager?: EntityManager,
  ): Promise<IAuthPhoneMethod>;

  async findOne(
    id: number,
    throwIfNotFound: false,
    manager?: EntityManager,
  ): Promise<IAuthPhoneMethod | null>;

  async findOne(
    id: number,
    throwIfNotFound: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAuthPhoneMethod | null> {
    const authMethod = await manager.findOne(AuthPhoneMethodEntity, {
      where: { id },
    });

    if (!authMethod) {
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

    return authMethod;
  }

  async findMany(
    userId: number | undefined,
    phone: string | undefined,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAuthPhoneMethod[]> {
    const authMethods = await manager.find(AuthPhoneMethodEntity, {
      where: { userId, phone },
    });

    return authMethods;
  }

  async createOne(
    userId: number,
    phone: string,
    password: string,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAuthPhoneMethod> {
    const authMethod = await manager.save(AuthPhoneMethodEntity, {
      userId,
      password,
      phone,
    });

    return authMethod;
  }

  async updateOne(
    id: number,
    password: string | undefined,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAuthPhoneMethod> {
    if (password !== undefined) {
      await manager.update(AuthPhoneMethodEntity, id, {
        password,
      });

      const authMethod = await this.findOne(id, true, manager);

      return authMethod;
    }

    throw new AppException(ERROR_MESSAGES.DB_NO_UPDATE_VALUES_PROVIDED);
  }
}
