import { makeValidator } from 'envalid';
import ms from 'ms';

import { AppException, ERROR_MESSAGES } from '@/shared';

const numOrBool = makeValidator((value: string) => {
  const num = parseInt(value, 10);
  const bool = JSON.parse(value);

  if (Number.isFinite(num)) {
    return num;
  }

  if (bool === true || bool === false) {
    return bool;
  }

  throw new AppException(ERROR_MESSAGES.ENV_VALUE_MUST_BE_NUM_OR_BOOL);
});

const msStringValue = makeValidator((value: string) => {
  const parsingResult = ms(value as ms.StringValue);

  if (parsingResult === undefined) {
    throw new AppException(ERROR_MESSAGES.ENV_VALUE_MUST_BE_MS_STR_VALUE);
  }

  return value as ms.StringValue;
});

export class EnvUtil {
  static numOrBool = numOrBool;

  static msStringValue = msStringValue;
}
