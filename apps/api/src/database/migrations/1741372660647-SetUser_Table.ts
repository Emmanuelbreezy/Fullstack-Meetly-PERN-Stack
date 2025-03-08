import { MigrationInterface, QueryRunner } from "typeorm";

export class SetUserTable1741372660647 implements MigrationInterface {
    name = 'SetUserTable1741372660647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integrations" ADD "expiry_date" bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integrations" DROP COLUMN "expiry_date"`);
    }

}
