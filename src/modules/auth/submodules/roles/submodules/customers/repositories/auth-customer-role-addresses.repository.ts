import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { AuthCustomerRoleAddressEntity } from '@/modules/auth/submodules/roles/submodules/customers/entities';
import { IAddress } from '@/shared';

@Injectable()
export class AuthCustomerRoleAddressesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createOne(
    authCustomerRoleId: number,
    city: string,
    street: string,
    building: string,
    block: string | null,
    apartment: string | null,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAddress> {
    const address = await manager.save(AuthCustomerRoleAddressEntity, {
      authCustomerRoleId,
      city,
      street,
      block,
      building,
      apartment,
    });

    return address;
  }

  async destroyOne(
    id: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    await manager.delete(AuthCustomerRoleAddressEntity, id);
  }
}
