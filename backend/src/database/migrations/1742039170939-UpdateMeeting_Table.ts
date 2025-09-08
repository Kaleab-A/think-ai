import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMeetingTable1742039170939 implements MigrationInterface {
    name = 'UpdateMeetingTable1742039170939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" ADD "calendarAppType" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "calendarAppType"`);
    }

}
