import ms from 'ms';

import { authConfig } from '@/configs';
import { ConfirmationCodesService } from '@/modules/auth/submodules/confirmations/services/confirmation-codes.service';
import { RandomUtil } from '@/shared';

export class NumericConfirmationCodesService extends ConfirmationCodesService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getValue(subject: string): string {
    const { phoneConfirmationCodeLength } = authConfig;

    const maxValue = 10 ** phoneConfirmationCodeLength - 1;

    const value = RandomUtil.getCryptoInt(0, maxValue);

    return value.toString().padStart(phoneConfirmationCodeLength, '0');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getExpiresAt(subject: string): Date {
    const { phoneConfirmationCodeExpiresIn } = authConfig;

    const date = new Date(Date.now() + ms(phoneConfirmationCodeExpiresIn));

    return date;
  }
}
