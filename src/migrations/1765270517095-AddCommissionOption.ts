import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCommissionOption1765270517095 implements MigrationInterface {
  name = 'AddCommissionOption1765270517095';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "commission_option_choice" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "option_id" uuid NOT NULL, "label" character varying NOT NULL, "order" integer NOT NULL, CONSTRAINT "PK_322a5daf690352dd4e3f1023aa8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8cf577c3924757dfb0eea8bb72" ON "commission_option_choice" ("option_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "commission_option" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "commission_id" uuid NOT NULL, "type" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying, "required" boolean NOT NULL DEFAULT false, "order" integer NOT NULL, CONSTRAINT "PK_9c7fe8b14d1b174ddb49183ad62" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cc204cc7ceffa952ecf025bb94" ON "commission_option" ("commission_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cc204cc7ceffa952ecf025bb94"`,
    );
    await queryRunner.query(`DROP TABLE "commission_option"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8cf577c3924757dfb0eea8bb72"`,
    );
    await queryRunner.query(`DROP TABLE "commission_option_choice"`);
  }
}
