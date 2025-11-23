import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSlot1763887664777 implements MigrationInterface {
  name = 'AddSlot1763887664777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_91986a65607b20ec6bf1406169"`,
    );
    await queryRunner.query(
      `CREATE TABLE "slot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "month" character varying NOT NULL, "count" integer NOT NULL, "active" boolean NOT NULL, CONSTRAINT "PK_5b1f733c4ba831a51f3c114607b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7811dd2c567efa5d1728d688e5" ON "slot" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_3be5c3150ec9d9af636760b517" ON "slot" ("user_id", "month") `,
    );
    await queryRunner.query(
      `ALTER TABLE "resource" ALTER COLUMN "uploaded" DROP DEFAULT`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c75f223e0e2de9bc75251ea805" ON "resource" ("user_id", "uploaded") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c75f223e0e2de9bc75251ea805"`,
    );
    await queryRunner.query(
      `ALTER TABLE "resource" ALTER COLUMN "uploaded" SET DEFAULT false`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3be5c3150ec9d9af636760b517"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7811dd2c567efa5d1728d688e5"`,
    );
    await queryRunner.query(`DROP TABLE "slot"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_91986a65607b20ec6bf1406169" ON "resource" ("uploaded", "user_id") `,
    );
  }
}
