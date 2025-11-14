import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPortfolio1763112334397 implements MigrationInterface {
  name = 'AddPortfolio1763112334397';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "portfolio" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "category" character varying NOT NULL, "description" character varying, "url" character varying NOT NULL, "thumbnail_url" character varying, "view_count" integer NOT NULL DEFAULT '0', "like_count" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_6936bb92ca4b7cda0ff28794e48" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_89055af4a272bb99a3d3ed2f24" ON "portfolio" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "portfolio_like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "portfolio_id" uuid NOT NULL, CONSTRAINT "PK_076eb1c1922f9f27c82b65f7951" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_53d1c16d5cf48ff4ec5126e927" ON "portfolio_like" ("user_id", "portfolio_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_53d1c16d5cf48ff4ec5126e927"`,
    );
    await queryRunner.query(`DROP TABLE "portfolio_like"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_89055af4a272bb99a3d3ed2f24"`,
    );
    await queryRunner.query(`DROP TABLE "portfolio"`);
  }
}
