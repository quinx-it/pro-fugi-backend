import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1763538347113 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* language=sql */ `
        DROP VIEW product_items_search_view
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* language=sql */ `
      DROP VIEW product_items_search_view
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE VIEW product_items_search_view
          (id, name, description, created_at, updated_at, base_price, discount_value, discount_percentage, price,
           rating, product_reviews_count, in_stock_number, product_category_id, specification, is_archived)
      AS
      SELECT pi.id,
             pi.name,
             pi.description,
             pi.created_at,
             pi.updated_at,
             pi.base_price,
             pi.discount_value,
             pi.discount_percentage,
             pi.base_price * (1::double precision - COALESCE(pi.discount_percentage, 0::double precision)) -
             COALESCE(pi.discount_value, 0::double precision) AS price,
             round(avg(pr.rating), 2)                         AS rating,
             count(pr.id)                                     AS product_reviews_count,
             pi.in_stock_number,
             pi.product_category_id,
             pi.specification,
             pi.is_archived
      FROM product_items pi
             LEFT JOIN product_reviews pr ON pr.product_item_id = pi.id
      GROUP BY pi.id, pi.name, pi.description, pi.created_at, pi.updated_at, pi.base_price, pi.discount_value,
               pi.discount_percentage, pi.in_stock_number, pi.product_category_id, pi.specification, pi.is_archived;
    `);
  }
}
