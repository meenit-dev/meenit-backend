import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInquiry1765427037219 implements MigrationInterface {
  name = 'AddInquiry1765427037219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "inquiry_answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "inquiry_id" uuid NOT NULL, "content" character varying NOT NULL, CONSTRAINT "PK_13021dd72bd67fbdf44b890c70f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f9e4e267f916cb3ef6c8f31010" ON "inquiry_answer" ("inquiry_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "inquiry" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "category" character varying NOT NULL, "answered_at" TIMESTAMP, CONSTRAINT "PK_3e226d0994e8bd24252dd65e1b6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2e53aa5aa7ddd006a62e650fe3" ON "inquiry" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "inquiry_resource" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "inquiry_id" uuid NOT NULL, "resource_id" uuid NOT NULL, CONSTRAINT "PK_70e671f5a67715919f270497453" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "inquiry_resource"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2e53aa5aa7ddd006a62e650fe3"`,
    );
    await queryRunner.query(`DROP TABLE "inquiry"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f9e4e267f916cb3ef6c8f31010"`,
    );
    await queryRunner.query(`DROP TABLE "inquiry_answer"`);
  }
}
