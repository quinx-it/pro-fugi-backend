import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1763457556446 implements MigrationInterface {
  name = 'Migration1763457556446';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* language=sql */ `
      DROP VIEW IF EXISTS product_orders_search_view;
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "auth_customer_role_addresses"
      (
        "id"                    SERIAL            NOT NULL,
        "city"                  character varying NOT NULL,
        "street"                character varying NOT NULL,
        "building"              character varying NOT NULL,
        "block"                 character varying,
        "apartment"             character varying,
        "auth_customer_role_id" integer           NOT NULL,
        CONSTRAINT "REL_auth_customer_role_addresses_auth_customer_role_id" UNIQUE ("auth_customer_role_id"),
        CONSTRAINT "PK_auth_customer_role_addresses_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "product_order_addresses"
      (
        "id"               SERIAL            NOT NULL,
        "city"             character varying NOT NULL,
        "street"           character varying NOT NULL,
        "building"         character varying NOT NULL,
        "block"            character varying,
        "apartment"        character varying,
        "product_order_id" integer           NOT NULL,
        CONSTRAINT "REL_product_order_addresses_product_order_id" UNIQUE ("product_order_id"),
        CONSTRAINT "PK_product_order_addresses_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_orders"
        DROP COLUMN "address";
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "auth_customer_roles"
        DROP COLUMN "address";
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "auth_customer_role_addresses"
        ADD CONSTRAINT "FK_auth_customer_role_addresses_auth_customer_role_id"
          FOREIGN KEY ("auth_customer_role_id") REFERENCES "auth_customer_roles" ("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION;
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_order_addresses"
        ADD CONSTRAINT "FK_product_order_addresses_product_order_id"
          FOREIGN KEY ("product_order_id") REFERENCES "product_orders" ("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION;
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE OR REPLACE VIEW public.product_orders_search_view AS
      SELECT po.id,
             concat_ws(
               ', ',
               poa.city,
               poa.street || ' ' || poa.building || COALESCE(' block ' || poa.block, '') ||
               COALESCE(' apt ' || poa.apartment, '')
             )                                                             AS address,
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
               WHEN SUM(poi.price_per_product_item * poi.count)::double precision >= po.config_free_shipping_threshold
                 THEN 0::double precision
               ELSE po.config_shipping_price
               END                                                         AS delivery_price,
             po.discount_value,
             po.discount_percentage,
             (
               SUM(poi.price_per_product_item * poi.count)::double precision
                 + CASE
                     WHEN SUM(poi.price_per_product_item * poi.count)::double precision >=
                          po.config_free_shipping_threshold
                       THEN 0::double precision
                     ELSE po.config_shipping_price
                 END
                 - po.discount_value
                 - (SUM(poi.price_per_product_item * poi.count)::double precision * po.discount_percentage)
                 + po.manual_price_adjustment
               )                                                           AS total_price
      FROM public.product_orders po
             JOIN public.auth_customer_roles acr ON acr.id = po.auth_customer_role_id
             JOIN public.product_order_items poi ON poi.product_order_id = po.id
             JOIN public.product_items pi ON pi.id = poi.product_item_id
             JOIN public.product_order_addresses poa ON poa.product_order_id = po.id
      GROUP BY po.id,
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
               po.discount_percentage,
               poa.city,
               poa.street,
               poa.building,
               poa.block,
               poa.apartment;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* language=sql */ `
      DROP VIEW IF EXISTS product_orders_search_view;
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_order_addresses"
        DROP CONSTRAINT "FK_product_order_addresses_product_order_id";
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "auth_customer_role_addresses"
        DROP CONSTRAINT "FK_auth_customer_role_addresses_auth_customer_role_id";
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "auth_customer_roles"
        ADD "address" character varying;
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_orders"
        ADD "address" character varying;
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE IF EXISTS "product_order_addresses";
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE IF EXISTS "auth_customer_role_addresses";
    `);
  }
}
