import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovePrivacyEventTable1739977643483 implements MigrationInterface {
    name = 'RemovePrivacyEventTable1739977643483'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "isPrivate"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "isPrivate" boolean NOT NULL DEFAULT true`);
    }

}
