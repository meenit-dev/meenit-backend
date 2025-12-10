import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCommissionUrls1765341309389 implements MigrationInterface {
  name = 'AddCommissionUrls1765341309389';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "commission_thumbnail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "commission_id" uuid NOT NULL, "resource_id" uuid NOT NULL, "order" integer NOT NULL, CONSTRAINT "PK_12f86ebd67075efc3ee417ee339" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_316f21dc2c444938a6734cac69" ON "commission_thumbnail" ("commission_id") `,
    );
    await queryRunner.query(`ALTER TABLE "commission" DROP COLUMN "url"`);
    await queryRunner.query(
      `ALTER TABLE "commission" DROP COLUMN "thumbnail_url"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "commission" ADD "thumbnail_url" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "commission" ADD "url" character varying`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_316f21dc2c444938a6734cac69"`,
    );
    await queryRunner.query(`DROP TABLE "commission_thumbnail"`);
  }
}
