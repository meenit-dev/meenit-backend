import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccountName1762999742855 implements MigrationInterface {
  name = 'AddAccountName1762999742855';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" ADD "name" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "name"`);
  }
}
