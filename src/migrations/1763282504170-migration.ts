import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1763282504170 implements MigrationInterface {
  name = 'Migration1763282504170';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "auth_admin_roles"
      (
        "id"           SERIAL                   NOT NULL,
        "name"         character varying        NOT NULL,
        "created_at"   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "auth_user_id" integer                  NOT NULL,
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
        "specification_schema" jsonb             NOT NULL DEFAULT '{}',
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
      CREATE TABLE "product_review_images"
      (
        "id"                SERIAL            NOT NULL,
        "file_name"         character varying NOT NULL,
        "product_review_id" integer           NOT NULL,
        CONSTRAINT "PK_product_review_images_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "product_reviews"
      (
        "id"                    SERIAL  NOT NULL,
        "rating"                integer NOT NULL,
        "text"                  character varying,
        "product_item_id"       integer NOT NULL,
        "auth_customer_role_id" integer NOT NULL,
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
        "specification"       jsonb             NOT NULL DEFAULT '{}',
        "is_archived"         boolean           NOT NULL DEFAULT false,
        "base_price"          double precision  NOT NULL,
        "discount_value"      double precision,
        "discount_percentage" double precision,
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
        "id"                             SERIAL            NOT NULL,
        "auth_customer_role_id"          integer,
        "created_at"                     TIMESTAMP         NOT NULL DEFAULT now(),
        "updated_at"                     TIMESTAMP         NOT NULL DEFAULT now(),
        "delivery_type"                  character varying NOT NULL,
        "status"                         character varying NOT NULL,
        "comment"                        character varying,
        "manual_price_adjustment"        double precision  NOT NULL,
        "address"                        character varying,
        "phone"                          character varying NOT NULL,
        "config_shipping_price"          double precision  NOT NULL,
        "config_free_shipping_threshold" double precision  NOT NULL,
        "discount_value"                 double precision  NOT NULL,
        "discount_percentage"            double precision  NOT NULL,
        CONSTRAINT "PK_product_orders_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "auth_customer_roles"
      (
        "id"           SERIAL                   NOT NULL,
        "first_name"   character varying,
        "last_name"    character varying,
        "address"      character varying,
        "created_at"   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "auth_user_id" integer                  NOT NULL,
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
        "id"           SERIAL                   NOT NULL,
        "auth_user_id" integer                  NOT NULL,
        "phone"        character varying        NOT NULL,
        "password"     character varying        NOT NULL,
        "created_at"   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
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
      CREATE OR REPLACE VIEW product_items_search_view AS
      SELECT pi.id,
             pi.name,
             pi.description,
             pi.created_at,
             pi.updated_at,
             pi.base_price,
             pi.discount_value,
             pi.discount_percentage,
             (pi.base_price * (1 - COALESCE(pi.discount_percentage, 0)) - COALESCE(pi.discount_value, 0)) AS price,
             ROUND(AVG(pr.rating)::numeric, 2)                                                            AS rating,
             COUNT(pr.id)                                                                                 AS product_reviews_count,
             pi.in_stock_number,
             pi.product_category_id,
             pi.specification,
             pi.is_archived
      FROM product_items pi
             LEFT JOIN product_reviews pr ON pr.product_item_id = pi.id
      GROUP BY pi.id,
               pi.name,
               pi.description,
               pi.created_at,
               pi.updated_at,
               pi.base_price,
               pi.discount_value,
               pi.discount_percentage,
               pi.in_stock_number,
               pi.product_category_id,
               pi.specification,
               pi.is_archived;
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE OR REPLACE VIEW public.product_orders_search_view
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
           discount_value,
           discount_percentage,
           total_price
            )
      AS
      SELECT po.id,
             po.address,
             po.phone,
             po.auth_customer_role_id,
             CASE
               WHEN acr.first_name IS NULL AND acr.last_name IS NULL THEN NULL::text
               ELSE concat_ws(
                 ' ',
                 NULLIF(trim(both FROM acr.first_name), ''),
                 NULLIF(trim(both FROM acr.last_name), '')
                    )
               END                                                         AS auth_customer_role_name,
             array_agg(DISTINCT poi.product_item_id)                       AS product_item_ids,
             array_agg(DISTINCT pi.name)                                   AS product_item_names,
             po.status,
             po.delivery_type,
             po.manual_price_adjustment,
             po.created_at,
             SUM(poi.price_per_product_item * poi.count)::double precision AS product_items_price,
             CASE
               WHEN SUM(poi.price_per_product_item * poi.count)::double precision
                 >= po.config_free_shipping_threshold
                 THEN 0::double precision
               ELSE po.config_shipping_price
               END                                                         AS delivery_price,
             po.discount_value,
             po.discount_percentage,
             (
               SUM(poi.price_per_product_item * poi.count)::double precision
                 +
               CASE
                 WHEN SUM(poi.price_per_product_item * poi.count)::double precision
                   >= po.config_free_shipping_threshold
                   THEN 0::double precision
                 ELSE po.config_shipping_price
                 END
                 -
               po.discount_value
                 -
               (SUM(poi.price_per_product_item * poi.count)::double precision * po.discount_percentage)
                 +
               po.manual_price_adjustment
               )                                                           AS total_price
      FROM public.product_orders po
             JOIN public.auth_customer_roles acr
                  ON acr.id = po.auth_customer_role_id
             JOIN public.product_order_items poi
                  ON poi.product_order_id = po.id
             JOIN public.product_items pi
                  ON pi.id = poi.product_item_id
      GROUP BY po.id,
               po.address,
               po.phone,
               po.auth_customer_role_id,
               acr.first_name,
               acr.last_name,
               po.status,
               po.delivery_type,
               po.manual_price_adjustment,
               po.created_at,
               po.config_shipping_price,
               po.config_free_shipping_threshold,
               po.discount_value,
               po.discount_percentage;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* language=sql */ `
      DROP VIEW IF EXISTS product_orders_search_view;
    `);

    await queryRunner.query(/* language=sql */ `
      DROP VIEW IF EXISTS product_items_search_view;
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "auth_phone_methods"
        DROP CONSTRAINT "FK_auth_phone_methods_auth_user_id";
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "auth_customer_roles"
        DROP CONSTRAINT "FK_auth_customer_roles_auth_user_id";
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_orders"
        DROP CONSTRAINT "FK_product_orders_auth_customer_role_id";
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_order_items"
        DROP CONSTRAINT "FK_product_order_items_product_order_id";
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_order_items"
        DROP CONSTRAINT "FK_product_order_items_product_item_id";
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_items"
        DROP CONSTRAINT "FK_product_items_product_category_id";
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_reviews"
        DROP CONSTRAINT "FK_product_reviews_auth_customer_role_id";
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_reviews"
        DROP CONSTRAINT "FK_product_reviews_product_item_id";
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_review_images"
        DROP CONSTRAINT "FK_product_review_images_product_review_id";
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_images"
        DROP CONSTRAINT "FK_product_images_product_item_id";
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "auth_admin_roles"
        DROP CONSTRAINT "FK_auth_admin_roles_auth_user_id";
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "auth_phone_methods";
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "auth_users";
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "auth_customer_roles";
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "product_orders";
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "product_order_items";
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "product_items";
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "product_reviews";
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "product_review_images";
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "product_images";
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "product_categories";
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "auth_admin_roles";
    `);
  }
}
