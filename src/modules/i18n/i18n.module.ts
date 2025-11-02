import { Module } from '@nestjs/common';

import { I18NService } from '@/modules/i18n/i18n.service';

@Module({
  providers: [I18NService],
  exports: [I18NService],
})
export class I18NModule {}
