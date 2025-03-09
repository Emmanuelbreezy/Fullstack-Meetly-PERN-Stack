import { MigrationInterface, QueryRunner } from "typeorm";

export class SetUserTable1741491434150 implements MigrationInterface {
    name = 'SetUserTable1741491434150'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."meetings_status_enum" RENAME TO "meetings_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."meetings_status_enum" AS ENUM('SCHEDULED', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "meetings" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "meetings" ALTER COLUMN "status" TYPE "public"."meetings_status_enum" USING "status"::"text"::"public"."meetings_status_enum"`);
        await queryRunner.query(`ALTER TABLE "meetings" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED'`);
        await queryRunner.query(`DROP TYPE "public"."meetings_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."meetings_status_enum_old" AS ENUM('SCHEDULED', 'CANCELED')`);
        await queryRunner.query(`ALTER TABLE "meetings" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "meetings" ALTER COLUMN "status" TYPE "public"."meetings_status_enum_old" USING "status"::"text"::"public"."meetings_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "meetings" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED'`);
        await queryRunner.query(`DROP TYPE "public"."meetings_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."meetings_status_enum_old" RENAME TO "meetings_status_enum"`);
    }

}
