import { MigrationInterface, QueryRunner } from "typeorm";

export class SetUserTable1740319171412 implements MigrationInterface {
    name = 'SetUserTable1740319171412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."meetings_status_enum" AS ENUM('SCHEDULED', 'CANCELED')`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD "status" "public"."meetings_status_enum" NOT NULL DEFAULT 'SCHEDULED'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."meetings_status_enum"`);
    }

}
