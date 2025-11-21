import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserProfileLink1763709913476 implements MigrationInterface {
  name = 'AddUserProfileLink1763709913476';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_profile" ADD "links" text array`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "links"`);
  }
}
