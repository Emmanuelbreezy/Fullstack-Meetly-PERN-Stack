import { MigrationInterface, QueryRunner } from "typeorm";

export class SetUserTable1740312893616 implements MigrationInterface {
    name = 'SetUserTable1740312893616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD "meetingTitle" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD "guestName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD "guestEmail" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "guestEmail"`);
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "guestName"`);
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "meetingTitle"`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD "name" character varying NOT NULL`);
    }

}
