import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1762951367812 implements MigrationInterface {
  name = 'Migration1762951367812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "auth_admin_roles"
      (
        "id"            SERIAL                   NOT NULL,
        "name"          character varying        NOT NULL,
        "created_at"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "auth_user_id"  integer                  NOT NULL,
        CONSTRAINT "REL_auth_admin_roles_auth_user_id" UNIQUE ("auth_user_id"),
        CONSTRAINT "PK_auth_admin_roles_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "product_categories"
      (
        "id"                   SERIAL            NOT NULL,
        "name"                 character varying NOT NULL,
        "is_archived"          boolean           NOT NULL DEFAULT false,
        "specification_schema" jsonb             NOT NULL DEFAULT '[]',
        CONSTRAINT "PK_product_categories_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "product_images"
      (
        "id"              SERIAL            NOT NULL,
        "file_name"       character varying NOT NULL,
        "type"            character varying NOT NULL,
        "product_item_id" integer           NOT NULL,
        CONSTRAINT "PK_product_images_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "product_prices"
      (
        "id"              SERIAL                   NOT NULL,
        "value"           integer                  NOT NULL,
        "created_at"      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "product_item_id" integer                  NOT NULL,
        CONSTRAINT "PK_product_prices_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "product_review_images"
      (
        "id"                 SERIAL            NOT NULL,
        "file_name"          character varying NOT NULL,
        "product_review_id"  integer           NOT NULL,
        CONSTRAINT "PK_product_review_images_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "product_reviews"
      (
        "id"                    SERIAL            NOT NULL,
        "rating"                integer           NOT NULL,
        "text"                  character varying,
        "product_item_id"       integer           NOT NULL,
        "auth_customer_role_id" integer           NOT NULL,
        CONSTRAINT "PK_product_reviews_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "product_items"
      (
        "id"                  SERIAL            NOT NULL,
        "name"                character varying NOT NULL,
        "description"         character varying NOT NULL,
        "created_at"          TIMESTAMP         NOT NULL DEFAULT now(),
        "updated_at"          TIMESTAMP         NOT NULL DEFAULT now(),
        "in_stock_number"     integer           NOT NULL,
        "product_category_id" integer           NOT NULL,
        "specification"       jsonb             NOT NULL DEFAULT '[]',
        "is_archived"         boolean           NOT NULL DEFAULT false,
        CONSTRAINT "PK_product_items_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "product_order_items"
      (
        "count"                  integer NOT NULL,
        "id"                     SERIAL  NOT NULL,
        "product_item_id"        integer NOT NULL,
        "product_order_id"       integer NOT NULL,
        "price_per_product_item" integer NOT NULL,
        CONSTRAINT "PK_product_order_items_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "product_orders"
      (
        "id"                         SERIAL            NOT NULL,
        "auth_customer_role_id"      integer,
        "created_at"                 TIMESTAMP         NOT NULL DEFAULT now(),
        "updated_at"                 TIMESTAMP         NOT NULL DEFAULT now(),
        "delivery_type"              character varying NOT NULL,
        "status"                     character varying NOT NULL,
        "comment"                    character varying,
        "manual_price_adjustment"    double precision  NOT NULL,
        "address"                    character varying,
        "phone"                      character varying NOT NULL,
        "config_shipping_price"      double precision  NOT NULL,
        "config_free_shipping_threshold" double precision NOT NULL,
        CONSTRAINT "PK_product_orders_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "auth_customer_roles"
      (
        "id"            SERIAL                   NOT NULL,
        "first_name"    character varying,
        "last_name"     character varying,
        "address"       character varying,
        "created_at"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "auth_user_id"  integer                  NOT NULL,
        CONSTRAINT "REL_auth_customer_roles_auth_user_id" UNIQUE ("auth_user_id"),
        CONSTRAINT "PK_auth_customer_roles_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "auth_users"
      (
        "id"         SERIAL                   NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_auth_users_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "auth_phone_methods"
      (
        "id"            SERIAL                   NOT NULL,
        "auth_user_id"  integer                  NOT NULL,
        "phone"         character varying        NOT NULL,
        "password"      character varying        NOT NULL,
        "created_at"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_auth_phone_methods_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "auth_admin_roles"
        ADD CONSTRAINT "FK_auth_admin_roles_auth_user_id"
          FOREIGN KEY ("auth_user_id") REFERENCES "auth_users" ("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_images"
        ADD CONSTRAINT "FK_product_images_product_item_id"
          FOREIGN KEY ("product_item_id") REFERENCES "product_items" ("id")
          ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_prices"
        ADD CONSTRAINT "FK_product_prices_product_item_id"
          FOREIGN KEY ("product_item_id") REFERENCES "product_items" ("id")
          ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_review_images"
        ADD CONSTRAINT "FK_product_review_images_product_review_id"
          FOREIGN KEY ("product_review_id") REFERENCES "product_reviews" ("id")
          ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_reviews"
        ADD CONSTRAINT "FK_product_reviews_product_item_id"
          FOREIGN KEY ("product_item_id") REFERENCES "product_items" ("id")
          ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_reviews"
        ADD CONSTRAINT "FK_product_reviews_auth_customer_role_id"
          FOREIGN KEY ("auth_customer_role_id") REFERENCES "auth_customer_roles" ("id")
          ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_items"
        ADD CONSTRAINT "FK_product_items_product_category_id"
          FOREIGN KEY ("product_category_id") REFERENCES "product_categories" ("id")
          ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_order_items"
        ADD CONSTRAINT "FK_product_order_items_product_item_id"
          FOREIGN KEY ("product_item_id") REFERENCES "product_items" ("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_order_items"
        ADD CONSTRAINT "FK_product_order_items_product_order_id"
          FOREIGN KEY ("product_order_id") REFERENCES "product_orders" ("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_orders"
        ADD CONSTRAINT "FK_product_orders_auth_customer_role_id"
          FOREIGN KEY ("auth_customer_role_id") REFERENCES "auth_customer_roles" ("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "auth_customer_roles"
        ADD CONSTRAINT "FK_auth_customer_roles_auth_user_id"
          FOREIGN KEY ("auth_user_id") REFERENCES "auth_users" ("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "auth_phone_methods"
        ADD CONSTRAINT "FK_auth_phone_methods_auth_user_id"
          FOREIGN KEY ("auth_user_id") REFERENCES "auth_users" ("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE VIEW product_orders_search_view
          (
           id,
           address,
           phone,
           auth_customer_role_id,
           auth_customer_role_name,
           product_item_ids,
           product_item_names,
           status,
           delivery_type,
           manual_price_adjustment,
           created_at,
           product_items_price,
           delivery_price,
           total_price
            )
      AS
      SELECT product_orders.id,
             product_orders.address,
             product_orders.phone,
             product_orders.auth_customer_role_id,
             CASE
               WHEN auth_customer_roles.first_name IS NULL AND auth_customer_roles.last_name IS NULL THEN NULL::text
               ELSE concat_ws(
                 ' '::text,
                 NULLIF(TRIM(BOTH FROM auth_customer_roles.first_name), ''::text),
                 NULLIF(TRIM(BOTH FROM auth_customer_roles.last_name), ''::text)
                    )
               END                                                                       AS auth_customer_role_name,
             array_agg(DISTINCT product_order_items.product_item_id)                     AS product_item_ids,
             array_agg(DISTINCT product_items.name)                                      AS product_item_names,
             product_orders.status,
             product_orders.delivery_type,
             product_orders.manual_price_adjustment,
             product_orders.created_at,
             sum(product_order_items.price_per_product_item * product_order_items.count) AS product_items_price,
             CASE
               WHEN sum(product_order_items.price_per_product_item * product_order_items.count)::double precision
                 >= product_orders.config_free_shipping_threshold
                 THEN 0::double precision
               ELSE product_orders.config_shipping_price
               END                                                                       AS delivery_price,
             sum(product_order_items.price_per_product_item * product_order_items.count)::double precision
               + CASE
                   WHEN sum(product_order_items.price_per_product_item * product_order_items.count)::double precision
                     >= product_orders.config_free_shipping_threshold
                     THEN 0::double precision
                   ELSE product_orders.config_shipping_price
               END
               + product_orders.manual_price_adjustment                                  AS total_price
      FROM product_orders
             JOIN auth_customer_roles ON auth_customer_roles.id = product_orders.auth_customer_role_id
             JOIN product_order_items ON product_order_items.product_order_id = product_orders.id
             JOIN product_items ON product_items.id = product_order_items.product_item_id
      GROUP BY product_orders.id,
               product_orders.address,
               product_orders.phone,
               product_orders.auth_customer_role_id,
               auth_customer_roles.first_name,
               auth_customer_roles.last_name,
               product_orders.status,
               product_orders.delivery_type,
               product_orders.manual_price_adjustment,
               product_orders.created_at,
               product_orders.config_shipping_price,
               product_orders.config_free_shipping_threshold;
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE OR REPLACE VIEW public.product_items_search_view AS
      SELECT product_items.id,
             product_items.name,
             product_items.description,
             product_items.created_at,
             product_items.updated_at,
             product_items.specification,
             product_items.product_category_id,
             (SELECT product_prices.value
              FROM public.product_prices
              WHERE product_prices.product_item_id = product_items.id
              ORDER BY product_prices.created_at DESC
              LIMIT 1)                                      AS price,
             ROUND(AVG(product_reviews.rating)::numeric, 2) AS rating,
             COUNT(product_reviews.id)                      AS product_reviews_count,
             product_items.in_stock_number                  AS in_stock_number,
             product_items.is_archived                      AS is_archived
      FROM public.product_items
             LEFT JOIN public.product_reviews
                       ON product_reviews.product_item_id = product_items.id
      GROUP BY product_items.id,
               product_items.name,
               product_items.description,
               product_items.created_at,
               product_items.updated_at,
               product_items.specification,
               product_items.product_category_id,
               product_items.in_stock_number,
               product_items.is_archived,
               (SELECT product_prices.value
                FROM public.product_prices
                WHERE product_prices.product_item_id = product_items.id
                ORDER BY product_prices.created_at DESC
                LIMIT 1);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* language=sql */ `
      DROP VIEW product_orders_search_view
    `);

    await queryRunner.query(/* language=sql */ `
      DROP VIEW product_items_search_view
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "auth_phone_methods"
        DROP CONSTRAINT "FK_auth_phone_methods_auth_user_id"
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "auth_customer_roles"
        DROP CONSTRAINT "FK_auth_customer_roles_auth_user_id"
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_orders"
        DROP CONSTRAINT "FK_product_orders_auth_customer_role_id"
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_order_items"
        DROP CONSTRAINT "FK_product_order_items_product_order_id"
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_order_items"
        DROP CONSTRAINT "FK_product_order_items_product_item_id"
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_items"
        DROP CONSTRAINT "FK_product_items_product_category_id"
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_reviews"
        DROP CONSTRAINT "FK_product_reviews_auth_customer_role_id"
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_reviews"
        DROP CONSTRAINT "FK_product_reviews_product_item_id"
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_review_images"
        DROP CONSTRAINT "FK_product_review_images_product_review_id"
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_prices"
        DROP CONSTRAINT "FK_product_prices_product_item_id"
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_images"
        DROP CONSTRAINT "FK_product_images_product_item_id"
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "auth_admin_roles"
        DROP CONSTRAINT "FK_auth_admin_roles_auth_user_id"
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "auth_phone_methods"
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "auth_users"
    `);

    await queryRunner.query(/* language=sql */ `
        DROP TABLE "auth_customer_roles"
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "product_orders"
    `);

    await queryRunner.query(/* language=sql */ `
        DROP TABLE "product_order_items"
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "product_items"
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "product_reviews"
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "product_review_images"
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "product_prices"
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "product_images"
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "product_categories"
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "auth_admin_roles"
    `);
  }
}
