import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddResourece1763725916032 implements MigrationInterface {
  name = 'AddResourece1763725916032';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "resource" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "type" character varying NOT NULL, "provider" character varying NOT NULL, "key" character varying NOT NULL, "size" integer NOT NULL, "content_type" character varying NOT NULL, "uploaded" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_e2894a5867e06ae2e8889f1173f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_91986a65607b20ec6bf1406169" ON "resource" ("user_id", "uploaded") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_05b3fb027948426ecb0b450e88" ON "resource" ("provider", "key") `,
    );
    await queryRunner.query(`ALTER TABLE "portfolio" DROP COLUMN "url"`);
    await queryRunner.query(
      `ALTER TABLE "portfolio" ADD "resource_id" uuid NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portfolio" DROP COLUMN "resource_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio" ADD "url" character varying NOT NULL`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_05b3fb027948426ecb0b450e88"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_91986a65607b20ec6bf1406169"`,
    );
    await queryRunner.query(`DROP TABLE "resource"`);
  }
}
