import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1763467637086 implements MigrationInterface {
  name = 'Migration1763467637086';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "partnership_letters"
      (
        "id"         SERIAL                   NOT NULL,
        "phone"      character varying        NOT NULL,
        "text"       character varying        NOT NULL,
        "is_read"    boolean                  NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_partnership_letters_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* language=sql */ `
      DROP TABLE "partnership_letters"
    `);
  }
}
