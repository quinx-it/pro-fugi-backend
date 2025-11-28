import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@/modules';
import { ProductGroupEntity } from '@/modules/products/submodules/groups/entities';
import ProductGroupsController from '@/modules/products/submodules/groups/product-groups.controller';
import { ProductGroupsService } from '@/modules/products/submodules/groups/product-groups.service';
import { ProductGroupsRepository } from '@/modules/products/submodules/groups/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([ProductGroupEntity]), AuthModule],
  providers: [ProductGroupsRepository, ProductGroupsService],
  controllers: [ProductGroupsController],
  exports: [ProductGroupsService],
})
export class ProductGroupsModule {}
