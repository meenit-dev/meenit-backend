import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFollow1764765961435 implements MigrationInterface {
  name = 'AddFollow1764765961435';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_efef1e5fdbe318a379c06678c51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_setting" DROP CONSTRAINT "FK_67adf5e48f4bbf832a081bf10f8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile" DROP CONSTRAINT "FK_eee360f3bff24af1b6890765201"`,
    );
    await queryRunner.query(
      `CREATE TABLE "follow" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "follow_user_id" uuid NOT NULL, CONSTRAINT "PK_fda88bc28a84d2d6d06e19df6e5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d3b514cd26ff6190a8f836f9b2" ON "follow" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1ce60948dbee924d380d3375a6" ON "follow" ("follow_user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "REL_efef1e5fdbe318a379c06678c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_setting" DROP CONSTRAINT "REL_67adf5e48f4bbf832a081bf10f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile" DROP CONSTRAINT "REL_eee360f3bff24af1b689076520"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_profile" ADD CONSTRAINT "REL_eee360f3bff24af1b689076520" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_setting" ADD CONSTRAINT "REL_67adf5e48f4bbf832a081bf10f" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "REL_efef1e5fdbe318a379c06678c5" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1ce60948dbee924d380d3375a6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d3b514cd26ff6190a8f836f9b2"`,
    );
    await queryRunner.query(`DROP TABLE "follow"`);
    await queryRunner.query(
      `ALTER TABLE "user_profile" ADD CONSTRAINT "FK_eee360f3bff24af1b6890765201" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_setting" ADD CONSTRAINT "FK_67adf5e48f4bbf832a081bf10f8" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_efef1e5fdbe318a379c06678c51" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
