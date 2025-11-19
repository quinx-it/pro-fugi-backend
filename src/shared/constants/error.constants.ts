import { Template } from '@/shared/utils/template';

export const ERROR_MESSAGES = {
  // region Env

  ENV_VALUE_MUST_BE_NUM_OR_BOOL: 'must be number or boolean',
  ENV_VALUE_MUST_BE_MS_STR_VALUE: 'must be an ms string value',
  ENV_VALUE_MUST_BE_JSON_ARRAY: 'must be a JSON array',

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
  AUTH_METHODS_CANNOT_CREATE_NEW_USER_WHEN_AUTHORIZED:
    'A confirmation code for a new user auth method cannot be created when user authorization is already provided. Must send an unauthorized request',
  AUTH_METHODS_USER_HAS_ANOTHER_SUBJECT_TEMPLATE: new Template<{
    value: string;
  }>(
    /* language=ejs */ 'Cannot create a confirmation code as the user had never had an auth method associated with subject <%= value %>',
  ),
  AUTH_ROLE_REQUIRED_TEMPLATE: new Template<{ authRole: string }>(
    /* language=ejs */ 'An auth of role of <%= authRole %> is required',
  ),
  AUTH_ROLE_FORBIDDEN_TEMPLATE: new Template<{ authRole: string }>(
    /* language=ejs */ 'The auth of role of <%= authRole %> is forbidden',
  ),
  AUTH_METHOD_OF_SUBJECT_NO_LONGER_ACTIVE_TEMPLATE: new Template<{
    value: string;
  }>(/* language=ejs */ 'The auth subject <%= value %> is no longer active'),
  // endregion

  // region Products

  PRODUCT_REVIEWS_ALREADY_EXISTS_FOR_ITEM:
    'A review of this customer already exists for the product item. Delete it to be able to create a new one or edit the existing one',
  PRODUCT_REVIEW_CUSTOMER_ID_MISMATCH:
    'The customer is not the creator of the product review.',
  PRODUCT_SPECS_SCHEMA_ITEM_NAME_DUPLICATES:
    'Product category specification scheme must not have duplicate keys',
  PRODUCT_SPECS_KEY_NOT_ALLOWED_BY_SCHEMA_TEMPLATE: new Template<{
    value: string;
  }>(
    /* language=ejs */ `Specification key <%= value %> is not allowed by product category schema.`,
  ),
  PRODUCT_SPECS_SCHEMA_VALUE_INVALID_TEMPLATE: new Template<{ value: string }>(
    /* language=ejs */ 'Invalid specs schema value: <%= value %> . Must be either an array of strings, a number range or null',
  ),
  PRODUCT_SPECS_SCHEMA_VALUE_INVALID:
    'Invalid specification schema. Must have no duplicate keys and each must be either an array of strings, a number range or null',
  PRODUCT_ITEMS_SPECS_SEARCH_REQUIRES_CATEGORY_ID:
    'Product items specification search requires categoryId to be provided',
  PRODUCT_ITEM_HAS_NO_RELEVANT_PRICE_TEMPLATE: new Template<{
    id: string;
    name: string;
  }>(
    /* language=ejs */ 'Product item { "id": <%= id %>, "name": <%= name %> } has no relevant price',
  ),
  PRODUCT_ITEM_NOT_ENOUGH_IN_STOCK: new Template<{
    id: string;
    name: string;
  }>(
    /* language=ejs */ 'Product item { "id": <%= id %>, "name": <%= name %> } in stock number is not enough to satisfy the order',
  ),
  PRODUCT_ITEM_IS_ARCHIVED: new Template<{
    id: string;
    name: string;
  }>(
    /* language=ejs */ 'Product item { "id": <%= id %>, "name": <%= name %> } is archived',
  ),
  PRODUCT_SPECS_SCHEMA_KEY_ABSENT: new Template<{ key: string }>(
    /* language=ejs */ 'Key <%= key %> must be a part of product specification',
  ),
  PRODUCT_DISCOUNT_POLICY_INVALID_ENTRY_TEMPLATE: new Template<{
    value: string;
  }>(/* language=ejs */ 'Invalid discount policy value: <%= value %>'),
  PRODUCT_CATEGORY_HAS_RELATED_ITEMS_TEMPLATE: new Template<{
    productCategoryId: string;
    productCategoryName: string;
  }>(
    /* language=ejs */ 'Product category{ "id": <%= productCategoryId %>, "name": <%= productCategoryName %> } has related items and cannot be deleted. Delete the related items first or set \'isArchived\' to true',
  ),
  PRODUCT_ITEM_HAS_RELATED_ORDERS_TEMPLATE: new Template<{
    productItemId: string;
    productItemName: string;
  }>(
    /* language=ejs */ 'Product category{ "id": <%= productItemId %>, "name": <%= productItemName %> } has related items and cannot be deleted. Delete the related items first or set \'isArchived\' to true',
  ),
  PRODUCT_ORDERS_ADMIN_QUERY_MUST_PROVIDE_PARAMS:
    'Must provide at least pagination (page, limit, offset) and sort (sort_by, descending) params when querying this resource with admin auth role',
  PRODUCT_ORDERS_CUSTOMER_QUERY_MUST_NOT_PROVIDE_PARAMS:
    'Must not provide any params when querying this resource with customer auth role',
  PRODUCT_FAVOURITES_CANNOT_HAVE_MORE_THAN_TEMPLATE: new Template<{
    limit: string;
  }>(
    /* language=ejs */ `Cannot have more than <%= limit %> favourite product items in total`,
  ),

  // endregion

  // region DB

  DB_NO_UPDATE_VALUES_PROVIDED: 'No update values provided',
  DB_RANGE_INVALID: 'Range invalid',
  DB_CANNOT_GET_RELATED_ENTITY_TEMPLATE: new Template<{
    relatedEntityName: string;
  }>(/* language=ejs */ `Cannot get related entity <%= relatedEntityName %>`),

  // endregion

  // region News

  NEWS_ARTICLE_NOT_PUBLISHED: 'The requested article is not published yet',

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
  MUST_BE_IN_TEMPLATE: new Template<{ value: string; list: string }>(
    /* language=ejs */ `<%= value %> must be in <%= list %>`,
  ),
  CANNOT_PARSE_BOOLEAN_VALUE_TEMPLATE: new Template<{
    value: string;
  }>(/* language=ejs */ `Cannot parse boolean value: <%= value %>`),

  // endregion

  // region Static

  STATIC_DIRECTORY_MISMATCH_TEMPLATE: new Template<{
    fileName: string;
    dirName: string;
  }>(
    /* language=ejs */ `The static file <%= fileName %> does not belong to <%= dirName %> catalog`,
  ),

  // endregion

  // region Cross-origin resource sharing

  ORIGIN_FORBIDDEN: 'Forbidden by CORS-policy',

  // endregion
};
