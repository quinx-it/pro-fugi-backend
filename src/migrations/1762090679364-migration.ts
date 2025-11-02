import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1762090679364 implements MigrationInterface {
  name = 'Migration1762090679364';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "admin_roles"
      (
        "id"         SERIAL                   NOT NULL,
        "name"       character varying        NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "user_id"    integer                  NOT NULL,
        CONSTRAINT "REL_admin_roles_user_id" UNIQUE ("user_id"),
        CONSTRAINT "PK_admin_roles_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "customer_roles"
      (
        "id"         SERIAL                   NOT NULL,
        "name"       character varying,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "user_id"    integer                  NOT NULL,
        CONSTRAINT "REL_customer_roles_user_id" UNIQUE ("user_id"),
        CONSTRAINT "PK_customer_roles_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "users"
      (
        "id"         SERIAL                   NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "auth_phone_methods"
      (
        "id"         SERIAL                   NOT NULL,
        "user_id"    integer                  NOT NULL,
        "phone"      character varying        NOT NULL,
        "password"   character varying        NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_auth_phone_methods_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "admin_roles"
        ADD CONSTRAINT "FK_admin_roles_user_id"
          FOREIGN KEY ("user_id") REFERENCES "users" ("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "customer_roles"
        ADD CONSTRAINT "FK_customer_roles_user_id"
          FOREIGN KEY ("user_id") REFERENCES "users" ("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "auth_phone_methods"
        ADD CONSTRAINT "FK_auth_phone_methods_user_id"
          FOREIGN KEY ("user_id") REFERENCES "users" ("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "auth_phone_methods"
        DROP CONSTRAINT "FK_auth_phone_methods_user_id"
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "customer_roles"
        DROP CONSTRAINT "FK_customer_roles_user_id"
    `);

    await queryRunner.query(/* language=sql */ `
      ALTER TABLE "admin_roles"
        DROP CONSTRAINT "FK_admin_roles_user_id"
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "auth_phone_methods"
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "users"
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "customer_roles"
    `);

    await queryRunner.query(/* language=sql */ `
      DROP TABLE "admin_roles"
    `);
  }
}
