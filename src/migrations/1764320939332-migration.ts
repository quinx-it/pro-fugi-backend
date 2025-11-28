import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1764320939332 implements MigrationInterface {
  name = 'Migration1764320939332';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* language=sql */ `
      DROP VIEW product_items_search_view
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "product_groups"
      (
        "id"                  SERIAL            NOT NULL,
        "name"                character varying NOT NULL,
        "description"         character varying NOT NULL,
        "image_file_name"     character varying,
        "product_category_id" integer           NOT NULL,
        CONSTRAINT "PK_product_groups_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_items"
        ADD "product_group_id" integer
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_groups"
        ADD CONSTRAINT "FK_product_groups_product_category_id"
          FOREIGN KEY ("product_category_id") REFERENCES "product_categories" ("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_items"
        ADD CONSTRAINT "FK_product_items_product_group_id"
          FOREIGN KEY ("product_group_id") REFERENCES "product_groups" ("id")
            ON DELETE SET NULL ON UPDATE SET NULL
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE OR REPLACE VIEW product_items_search_view
          (id, name, description, created_at, updated_at, base_price, discount_value, discount_percentage, price,
           rating, product_reviews_count, in_stock_number, product_category_id, product_group_id, specification,
           is_archived, popularity)
      AS
      SELECT pi.id,
             pi.name,
             pi.description,
             pi.created_at,
             pi.updated_at,
             pi.base_price,
             pi.discount_value,
             pi.discount_percentage,
             pi.base_price * (1 - COALESCE(pi.discount_percentage, 0)) -
             COALESCE(pi.discount_value, 0)                                   AS price,
             ROUND(AVG(pr.rating), 2)                                         AS rating,
             COUNT(pr.id)                                                     AS product_reviews_count,
             pi.in_stock_number,
             pi.product_category_id,
             pi.product_group_id,
             pi.specification,
             pi.is_archived,
             COALESCE((SELECT COUNT(poi.id)
                       FROM product_order_items poi
                              JOIN product_orders po ON po.id = poi.product_order_id
                       WHERE poi.product_item_id = pi.id
                         AND po.created_at >= NOW() - INTERVAL '30 days'), 0) AS popularity
      FROM product_items pi
             LEFT JOIN product_reviews pr ON pr.product_item_id = pi.id
      GROUP BY pi.id, pi.name, pi.description, pi.created_at, pi.updated_at,
               pi.base_price, pi.discount_value, pi.discount_percentage,
               pi.in_stock_number, pi.product_category_id,
               pi.specification, pi.is_archived;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* language=sql */ `
      DROP VIEW product_items_search_view
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_items"
        DROP CONSTRAINT "FK_product_items_product_group_id"
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_groups"
        DROP CONSTRAINT "FK_product_groups_product_category_id"
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "product_items"
        DROP COLUMN "product_group_id"
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "product_groups"
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE OR REPLACE VIEW product_items_search_view
          (id, name, description, created_at, updated_at, base_price, discount_value, discount_percentage, price,
           rating, product_reviews_count, in_stock_number, product_category_id, specification, is_archived,
           popularity)
      AS
      SELECT pi.id,
             pi.name,
             pi.description,
             pi.created_at,
             pi.updated_at,
             pi.base_price,
             pi.discount_value,
             pi.discount_percentage,
             pi.base_price * (1 - COALESCE(pi.discount_percentage, 0)) -
             COALESCE(pi.discount_value, 0)                                   AS price,
             ROUND(AVG(pr.rating), 2)                                         AS rating,
             COUNT(pr.id)                                                     AS product_reviews_count,
             pi.in_stock_number,
             pi.product_category_id,
             pi.specification,
             pi.is_archived,
             COALESCE((SELECT COUNT(poi.id)
                       FROM product_order_items poi
                              JOIN product_orders po ON po.id = poi.product_order_id
                       WHERE poi.product_item_id = pi.id
                         AND po.created_at >= NOW() - INTERVAL '30 days'), 0) AS popularity
      FROM product_items pi
             LEFT JOIN product_reviews pr ON pr.product_item_id = pi.id
      GROUP BY pi.id, pi.name, pi.description, pi.created_at, pi.updated_at,
               pi.base_price, pi.discount_value, pi.discount_percentage,
               pi.in_stock_number, pi.product_category_id,
               pi.specification, pi.is_archived;
    `);
  }
}
