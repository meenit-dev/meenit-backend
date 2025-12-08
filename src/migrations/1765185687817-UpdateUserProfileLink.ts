import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserProfileLink1765185687817 implements MigrationInterface {
  name = 'UpdateUserProfileLink1765185687817';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "links"`);
    await queryRunner.query(`ALTER TABLE "user_profile" ADD "links" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "links"`);
    await queryRunner.query(
      `ALTER TABLE "user_profile" ADD "links" text array`,
    );
  }
}
