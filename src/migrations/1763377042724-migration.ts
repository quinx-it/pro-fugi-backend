import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1763377042724 implements MigrationInterface {
  name = 'Migration1763377042724';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* language=sql */ `
      CREATE TABLE "news_articles"
      (
        "id"               SERIAL                   NOT NULL,
        "title"            character varying        NOT NULL,
        "description"      character varying        NOT NULL,
        "image_file_name"  character varying        NOT NULL,
        "content_markdown" character varying        NOT NULL,
        "tags"             character varying array  NOT NULL,
        "created_at"       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at"       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "publish_at"       TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_news_articles_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* language=sql */ `
      DROP TABLE "news_articles"`);
  }
}
