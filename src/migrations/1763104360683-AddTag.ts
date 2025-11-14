import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTag1763104360683 implements MigrationInterface {
  name = 'AddTag1763104360683';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "count" integer NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6a9775008add570dc3e5a0bab7" ON "tag" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7336b2858fc9974f0d2c3a52c5" ON "tag" ("count") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7336b2858fc9974f0d2c3a52c5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6a9775008add570dc3e5a0bab7"`,
    );
    await queryRunner.query(`DROP TABLE "tag"`);
  }
}
