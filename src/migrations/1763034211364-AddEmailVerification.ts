import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerification1763034211364 implements MigrationInterface {
  name = 'AddEmailVerification1763034211364';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "email_verification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "expired_at" TIMESTAMP NOT NULL, "used_at" TIMESTAMP WITH TIME ZONE, "email" character varying NOT NULL, "code" character varying NOT NULL, CONSTRAINT "PK_b985a8362d9dac51e3d6120d40e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3ffc9210f041753e837b29d9e5" ON "email_verification" ("email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3ffc9210f041753e837b29d9e5"`,
    );
    await queryRunner.query(`DROP TABLE "email_verification"`);
  }
}
