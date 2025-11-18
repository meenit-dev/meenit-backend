import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSsoAccount1763441012592 implements MigrationInterface {
  name = 'AddSsoAccount1763441012592';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sso_account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "provider" character varying NOT NULL, "sso_id" character varying NOT NULL, "avatar" character varying, CONSTRAINT "PK_a5e943586a2a9edfbd7dff89196" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a42f074be2ef80aaac043c9169" ON "sso_account" ("sso_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a42f074be2ef80aaac043c9169"`,
    );
    await queryRunner.query(`DROP TABLE "sso_account"`);
  }
}
