import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1763893964821 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* language=sql */ `
      CREATE VIEW auth_users_search_view AS
      SELECT au.id,
             au.created_at,
             aar.name     AS admin_name,
             CASE
               WHEN acr.id IS NOT NULL THEN concat_ws(' ', acr.first_name, acr.last_name)
               ELSE NULL
               END        AS customer_full_name,
             CASE
               WHEN acr.id IS NOT NULL THEN concat_ws(' ', acra.city, acra.street, acra.building, acra.block,
                                                      acra.apartment)
               ELSE NULL
               END        AS customer_address,
             (SELECT apm.phone
              FROM auth_phone_methods apm
              WHERE apm.auth_user_id = au.id
              ORDER BY apm.created_at DESC
              LIMIT 1)    AS phone,
             ARRAY_REMOVE(
               ARRAY [
                 CASE WHEN aar.id IS NOT NULL THEN 'admin'::varchar END,
                 CASE WHEN acr.id IS NOT NULL THEN 'customer'::varchar END
                 ],
               NULL
             )::varchar[] AS roles
      FROM auth_users au
             LEFT JOIN auth_admin_roles aar ON aar.auth_user_id = au.id
             LEFT JOIN auth_customer_roles acr ON acr.auth_user_id = au.id
             LEFT JOIN auth_customer_role_addresses acra ON acra.auth_customer_role_id = acr.id;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* language=sql */ `
      DROP VIEW auth_users_search_view;
    `);
  }
}
