import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNoticeTypeToCategory1765358881707
  implements MigrationInterface
{
  name = 'UpdateNoticeTypeToCategory1765358881707';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notice" RENAME COLUMN "type" TO "category"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notice" RENAME COLUMN "category" TO "type"`,
    );
  }
}
