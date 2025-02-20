import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeToMeetingTable1739978512641 implements MigrationInterface {
    name = 'ChangeToMeetingTable1739978512641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "meeting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "additionalInfo" character varying, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "meetLink" character varying NOT NULL, "googleEventId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventId" uuid, "userId" uuid, CONSTRAINT "PK_dccaf9e4c0e39067d82ccc7bb83" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "event" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meeting" ADD CONSTRAINT "FK_7aa245268e5a7d1137d0fe446c4" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meeting" ADD CONSTRAINT "FK_854982a74818bb6307419e0e6b8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meeting" DROP CONSTRAINT "FK_854982a74818bb6307419e0e6b8"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP CONSTRAINT "FK_7aa245268e5a7d1137d0fe446c4"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "slug"`);
        await queryRunner.query(`DROP TABLE "meeting"`);
    }

}
