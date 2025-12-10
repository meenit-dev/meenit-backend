import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotice1765356720620 implements MigrationInterface {
  name = 'AddNotice1765356720620';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notice" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying NOT NULL, "content" character varying NOT NULL, "pin" boolean NOT NULL DEFAULT false, "type" character varying NOT NULL, CONSTRAINT "PK_705062b14410ff1a04998f86d72" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "notice"`);
  }
}
