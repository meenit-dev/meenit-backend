import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotification1765346021517 implements MigrationInterface {
  name = 'AddNotification1765346021517';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notification_template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "code" character varying NOT NULL, "link" character varying, "type" character varying NOT NULL, "message" character varying NOT NULL, CONSTRAINT "PK_d2a6ef77141a01b8ac31f514cfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "notification_template_id" uuid NOT NULL, "link" character varying, "message" character varying NOT NULL, "replace_template_data" jsonb, "read_at" TIMESTAMP, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_709570ea23197bf75890da5a6a" ON "notification" ("user_id", "read_at") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_709570ea23197bf75890da5a6a"`,
    );
    await queryRunner.query(`DROP TABLE "notification"`);
    await queryRunner.query(`DROP TABLE "notification_template"`);
  }
}
