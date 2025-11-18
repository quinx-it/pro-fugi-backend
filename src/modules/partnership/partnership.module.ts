import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@/modules/auth/auth.module';
import { PartnershipLetterEntity } from '@/modules/partnership/entities';
import { PartnershipController } from '@/modules/partnership/partnership.controller';
import { PartnershipService } from '@/modules/partnership/partnership.service';
import { PartnershipLettersRepository } from '@/modules/partnership/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([PartnershipLetterEntity]), AuthModule],
  providers: [PartnershipLettersRepository, PartnershipService],
  controllers: [PartnershipController],
})
export class PartnershipModule {}
