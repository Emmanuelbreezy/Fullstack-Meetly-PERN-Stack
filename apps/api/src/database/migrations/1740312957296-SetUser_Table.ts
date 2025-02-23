import { MigrationInterface, QueryRunner } from "typeorm";

export class SetUserTable1740312957296 implements MigrationInterface {
    name = 'SetUserTable1740312957296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "meetingTitle"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" ADD "meetingTitle" character varying NOT NULL`);
    }

}
