import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReport1765105833609 implements MigrationInterface {
  name = 'AddReport1765105833609';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "target_type" character varying NOT NULL, "target_id" uuid NOT NULL, "reason" character varying NOT NULL, "reporter_id" uuid NOT NULL, "resolved_at" TIMESTAMP, CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "report_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" character varying NOT NULL, "report_id" uuid NOT NULL, CONSTRAINT "PK_324366e10cf40cf2ac60c502a00" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "report_resource" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "report_id" uuid NOT NULL, "resource_id" uuid NOT NULL, CONSTRAINT "PK_ac30e00947d826b37dfa4690c8a" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "report_resource"`);
    await queryRunner.query(`DROP TABLE "report_type"`);
    await queryRunner.query(`DROP TABLE "report"`);
  }
}
