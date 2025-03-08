import { MigrationInterface, QueryRunner } from "typeorm";

export class SetUserTable1741372586339 implements MigrationInterface {
    name = 'SetUserTable1741372586339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integrations" DROP COLUMN "expiry_date"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integrations" ADD "expiry_date" bigint`);
    }

}
