import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFollowUniqueIndex1765413232244 implements MigrationInterface {
  name = 'AddFollowUniqueIndex1765413232244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d3b514cd26ff6190a8f836f9b2"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_765b170f854c6cdec26f85579a" ON "follow" ("user_id", "follow_user_id") WHERE "deleted_at" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_765b170f854c6cdec26f85579a"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d3b514cd26ff6190a8f836f9b2" ON "follow" ("user_id") `,
    );
  }
}
