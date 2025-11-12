import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserProfileAccountTable1762998397407
  implements MigrationInterface
{
  name = 'AddUserProfileAccountTable1762998397407';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "code" character varying NOT NULL, "number" character varying NOT NULL, CONSTRAINT "REL_efef1e5fdbe318a379c06678c5" UNIQUE ("user_id"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_efef1e5fdbe318a379c06678c5" ON "account" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "introduction" character varying, "background" character varying, CONSTRAINT "REL_eee360f3bff24af1b689076520" UNIQUE ("user_id"), CONSTRAINT "PK_f44d0cd18cfd80b0fed7806c3b7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eee360f3bff24af1b689076520" ON "user_profile" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "type" character varying NOT NULL DEFAULT 'user'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "handle" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "phone" character varying`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_53197e5dba5dbaf94d29c8edbd" ON "user" ("handle") `,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_efef1e5fdbe318a379c06678c51" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile" ADD CONSTRAINT "FK_eee360f3bff24af1b6890765201" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_profile" DROP CONSTRAINT "FK_eee360f3bff24af1b6890765201"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_efef1e5fdbe318a379c06678c51"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_53197e5dba5dbaf94d29c8edbd"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "handle"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "type"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_eee360f3bff24af1b689076520"`,
    );
    await queryRunner.query(`DROP TABLE "user_profile"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_efef1e5fdbe318a379c06678c5"`,
    );
    await queryRunner.query(`DROP TABLE "account"`);
  }
}
