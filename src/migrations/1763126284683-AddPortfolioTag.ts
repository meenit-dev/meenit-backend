import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPortfolioTag1763126284683 implements MigrationInterface {
  name = 'AddPortfolioTag1763126284683';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "portfolio_tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "portfolio_id" uuid NOT NULL, "tag_id" uuid NOT NULL, CONSTRAINT "PK_8ed7d7904c37b1af5ce2b254a45" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bb794402121a282c3f2b8c1551" ON "portfolio_tag" ("portfolio_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bb794402121a282c3f2b8c1551"`,
    );
    await queryRunner.query(`DROP TABLE "portfolio_tag"`);
  }
}
