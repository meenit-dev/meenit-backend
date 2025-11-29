import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatorSetting1764403485134 implements MigrationInterface {
  name = 'AddCreatorSetting1764403485134';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bb794402121a282c3f2b8c1551"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3be5c3150ec9d9af636760b517"`,
    );
    await queryRunner.query(
      `CREATE TABLE "creator_setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "slot_month_split_count" integer NOT NULL, "slot_defaul_status" character varying NOT NULL, CONSTRAINT "REL_67adf5e48f4bbf832a081bf10f" UNIQUE ("user_id"), CONSTRAINT "PK_b791eaa1075290b23af9ab62dd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_67adf5e48f4bbf832a081bf10f" ON "creator_setting" ("user_id") `,
    );
    await queryRunner.query(`ALTER TABLE "slot" DROP COLUMN "count"`);
    await queryRunner.query(`ALTER TABLE "slot" DROP COLUMN "active"`);
    await queryRunner.query(`ALTER TABLE "slot" ADD "split" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "slot" ADD "status" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ccecd3ad9587de2e2629faf281" ON "portfolio_tag" ("portfolio_id", "tag_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8e5b79bcd357e753d712f9c27e" ON "slot" ("user_id", "month", "split") `,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_setting" ADD CONSTRAINT "FK_67adf5e48f4bbf832a081bf10f8" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "creator_setting" DROP CONSTRAINT "FK_67adf5e48f4bbf832a081bf10f8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8e5b79bcd357e753d712f9c27e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ccecd3ad9587de2e2629faf281"`,
    );
    await queryRunner.query(`ALTER TABLE "slot" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "slot" DROP COLUMN "split"`);
    await queryRunner.query(`ALTER TABLE "slot" ADD "active" boolean NOT NULL`);
    await queryRunner.query(`ALTER TABLE "slot" ADD "count" integer NOT NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_67adf5e48f4bbf832a081bf10f"`,
    );
    await queryRunner.query(`DROP TABLE "creator_setting"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_3be5c3150ec9d9af636760b517" ON "slot" ("month", "user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bb794402121a282c3f2b8c1551" ON "portfolio_tag" ("portfolio_id") `,
    );
  }
}
