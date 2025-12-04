import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { AuthCustomerRoleAddressesRepository } from '@/modules/auth/submodules/roles/submodules/customers/repositories';
import { AuthCustomerRolesRepository } from '@/modules/auth/submodules/roles/submodules/customers/repositories/auth-customer-roles.repository';
import {
  IAuthCustomerRole,
  IAuthCustomerRoleAddress,
} from '@/modules/auth/submodules/roles/submodules/customers/types';
import { AppException, DbUtil, ERROR_MESSAGES, IAddress } from '@/shared';

@Injectable()
export class AuthCustomerRolesService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly repo: AuthCustomerRolesRepository,
    private readonly addressesRepo: AuthCustomerRoleAddressesRepository,
  ) {}

  async findOne(
    id: number,
    throwIfNotFound: true,
    manager?: EntityManager,
  ): Promise<IAuthCustomerRole>;

  async findOne(
    id: number,
    throwIfNotFound: false,
    manager?: EntityManager,
  ): Promise<IAuthCustomerRole | null>;

  async findOne(
    id: number,
    throwIfNotFound: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAuthCustomerRole | null> {
    const authCustomerRole = throwIfNotFound
      ? await this.repo.findOne(id, true, manager)
      : await this.repo.findOne(id, false, manager);

    return authCustomerRole;
  }

  async createOne(
    userId: number,
    firstName: string | null,
    lastName: string | null,
    address: IAddress | null,
    manager: EntityManager | null = null,
  ): Promise<IAuthCustomerRole> {
    return DbUtil.transaction(
      async (transactionManager) => {
        const existingCustomerRole = await this.repo.findOneByUserId(
          userId,
          false,
          transactionManager,
        );

        if (existingCustomerRole) {
          throw AppException.fromTemplate(
            ERROR_MESSAGES.ALREADY_EXISTS_TEMPLATE,
            {
              value: 'Auth customer role',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        const authCustomerRole = await this.repo.createOne(
          userId,
          firstName,
          lastName,
          transactionManager,
        );

        if (address !== null) {
          const { id: authCustomerRoleId } = authCustomerRole;

          const { city, street, building, block, apartment } = address;

          await this.addressesRepo.createOne(
            authCustomerRoleId,
            city,
            street,
            building,
            block,
            apartment,
            transactionManager,
          );

          return this.repo.findOne(
            authCustomerRoleId,
            true,
            transactionManager,
          );
        }

        return authCustomerRole;
      },
      this.dataSource,
      manager,
    );
  }

  async updateOne(
    authUserId: number,
    firstName?: string | null,
    lastName?: string | null,
    address?: IAddress | null,
    manager: EntityManager | null = null,
  ): Promise<IAuthCustomerRole> {
    const result = await DbUtil.transaction(
      async (transactionManager) => {
        const authCustomerRoleExisting = await this.repo.findOneByUserId(
          authUserId,
          true,
          transactionManager,
        );

        const { id: authCustomerRoleId } = authCustomerRoleExisting;

        if (address !== undefined) {
          const existingAddress: IAuthCustomerRoleAddress | null =
            DbUtil.getRelatedEntityOrThrow<
              IAuthCustomerRole,
              IAuthCustomerRoleAddress
            >(authCustomerRoleExisting, 'address');

          if (existingAddress) {
            await this.addressesRepo.destroyOne(
              existingAddress.id,
              transactionManager,
            );
          }

          if (address) {
            const { city, street, building, block, apartment } = address;

            await this.addressesRepo.createOne(
              authCustomerRoleId,
              city,
              street,
              building,
              block,
              apartment,
              transactionManager,
            );
          }
        }

        const authCustomerRole = await this.repo.updateOne(
          authCustomerRoleId,
          firstName,
          lastName,
          transactionManager,
        );

        return authCustomerRole;
      },
      this.dataSource,
      manager,
    );

    return result;
  }
}
