import { MigrationInterface, QueryRunner } from "typeorm";

export class SetUserTable1740318766833 implements MigrationInterface {
    name = 'SetUserTable1740318766833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" RENAME COLUMN "calenderEventId" TO "calendarEventId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" RENAME COLUMN "calendarEventId" TO "calenderEventId"`);
    }

}
