import { MigrationInterface, QueryRunner } from "typeorm";

export class SetUserTable1740314716086 implements MigrationInterface {
    name = 'SetUserTable1740314716086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" RENAME COLUMN "googleEventId" TO "calenderEventId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" RENAME COLUMN "calenderEventId" TO "googleEventId"`);
    }

}
