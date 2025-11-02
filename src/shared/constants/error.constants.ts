import { Template } from '@/shared/utils/template';

export const ERROR_MESSAGES = {
  // region Env

  ENV_VALUE_MUST_BE_NUM_OR_BOOL: 'must be number or boolean',
  ENV_VALUE_MUST_BE_MS_STR_VALUE: 'must be an ms string value',

  // endregion

  // region Validation

  VALIDATION_MUST_BE_A_RECORD_OF_STRING_ARRAYS_TEMPLATE: new Template<{
    value: string;
  }>(
    /* language=ejs */ `<%= value  %> must be a record with string keys and arrays of strings as values`,
  ),

  // endregion

  // region HTTP

  HTTP_INTERNAL_SERVER_ERROR: 'Internal Server Error',

  // endregion

  // region Auth

  AUTH_USERS_ROLE_UNKNOWN_TEMPLATE: new Template<{
    value: string;
  }>(/* language=ejs */ 'User role <%= value %> is unknown'),
  AUTH_USERS_DATA_INVALID: 'User data is invalid',
  AUTH_USERS_PROVIDER_ENTITY_NAME: 'Admin user',
  AUTH_METHODS_USERNAME_ENTITY_NAME: 'Phone and password auth option',
  AUTH_USERS_ROLE_MISMATCH_TEMPLATE: new Template<{
    expectedRole: string;
    actualRoles: string;
  }>(
    /* language=ejs */ 'A role of "<%= expectedRole %>" is required, but only "<%= actualRoles %>" roles are found',
  ),
  AUTH_TOKENS_INVALID_OR_EXPIRED: 'Auth token is either invalid or expired',
  AUTH_CONFIRMATION_CODES_INVALID_OR_EXPIRED:
    'The confirmation code is either invalid or expired',
  AUTH_METHODS_WRONG_PASSWORD: 'Wrong password',
  AUTH_METHODS_PASSWORD_MUST_DIFFER:
    'A new password must differ from all the previous ones',
  AUTH_METHODS_SUBJECT_ALREADY_IN_USE_TEMPLATE: new Template<{ value: string }>(
    /* language=ejs */ 'An auth method already exists for subject <%= value %>. This subject cannot be used to instantiate a new user',
  ),
  AUTH_METHODS_SUBJECT_NOT_IN_USE_TEMPLATE: new Template<{ value: string }>(
    /* language=ejs */ 'No previously created auth methods associated with subject <%= value %> were found. This subject can only be used to instantiate a new user',
  ),

  // endregion

  // region DB

  DB_NO_UPDATE_VALUES_PROVIDED: 'No update values provided',
  DB_RANGE_INVALID: 'Range invalid',

  // endregion

  // region Common

  NOT_FOUND_TEMPLATE: new Template<{ value: string }>(
    /* language=ejs */ `<%= value %> not found`,
  ),
  ALREADY_EXISTS_TEMPLATE: new Template<{ value: string }>(
    /* language=ejs */ `<%= value %> already exists`,
  ),
  MULTIPLE_FOUND_TEMPLATE: new Template<{ value: string }>(
    /* language=ejs */ `Found multiple <%= value %> when only one expected`,
  ),
  RANGE_INVALID_TEMPLATE: new Template<{ value: string }>(
    /* language=ejs */ `Range of <%= value %> is invalid`,
  ),
  MUST_BE_GREATER_OR_EQUAL_TEMPLATE: new Template<{
    key: string;
    value: string;
  }>(
    /* language=ejs */ `<%= key %> must be greater or equal than <%= value %>`,
  ),
  MUST_BE_STRICTLY_GREATER_TEMPLATE: new Template<{
    key: string;
    value: string;
  }>(
    /* language=ejs */ `<%= key %> must be strictly greater than <%= value %>`,
  ),
  MUST_BE_LESS_OR_EQUAL_TEMPLATE: new Template<{ key: string; value: string }>(
    /* language=ejs */ `<%= key %> must be less or equal than <%= value %>`,
  ),
  MUST_BE_STRICTLY_LESS_TEMPLATE: new Template<{ key: string; value: string }>(
    /* language=ejs */ `<%= key %> must be strictly less than <%= value %>`,
  ),
  MUST_NOT_BE_NULL_TEMPLATE: new Template<{ key: string }>(
    /* language=ejs */ `<%= key %> must not be null`,
  ),
  TYPE_MISMATCH_TEMPLATE: new Template<{
    value: string;
    expectedType: string;
    actualType: string;
  }>(
    /* language=ejs */ `Expected <%= value %> to be of type <%= expectedType %>, but got <%= actualType %> instead`,
  ),
  MISSING_TEMPLATE: new Template<{ values: string; object: string }>(
    /* language=ejs */ `Fields <%= values %> are missing in <%= object %> `,
  ),
  NOT_PROVIDED_TEMPLATE: new Template<{ value: string }>(
    /* language=ejs */ `Value(s) for <%= value %> was (were) not provided`,
  ),
  AT_LEAST_ONE_MUST_BE_DEFINED_TEMPLATE: new Template<{ value: string }>(
    /* language=ejs */ `At least one of the values must be defined: <%= value %>`,
  ),
  AT_LEAST_ONE_MUST_BE_NOT_NULL_TEMPLATE: new Template<{ value: string }>(
    /* language=ejs */ `At least one of the values must be not null <%= value %>`,
  ),

  // endregion
};
