import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommission1763286166168 implements MigrationInterface {
    name = 'AddCommission1763286166168'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "commission_tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "commission_id" uuid NOT NULL, "tag_id" uuid NOT NULL, CONSTRAINT "PK_a963cf8dbed78cda31bbd2ad789" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_eafb79c9ec90ce4ee78a18a0e9" ON "commission_tag" ("commission_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_76cd2a9cd01a1473ca8a65acd8" ON "commission_tag" ("tag_id") `);
        await queryRunner.query(`CREATE TABLE "commission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "category" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "contents" character varying NOT NULL, "url" character varying, "thumbnail_url" character varying, CONSTRAINT "PK_d108d70411783e2a3a84e386601" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f5203b3cbb45890eadb9839409" ON "commission" ("user_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_f5203b3cbb45890eadb9839409"`);
        await queryRunner.query(`DROP TABLE "commission"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_76cd2a9cd01a1473ca8a65acd8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eafb79c9ec90ce4ee78a18a0e9"`);
        await queryRunner.query(`DROP TABLE "commission_tag"`);
    }

}
