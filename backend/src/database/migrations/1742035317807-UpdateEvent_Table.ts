import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventTable1742035317807 implements MigrationInterface {
    name = 'UpdateEventTable1742035317807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetings" ALTER COLUMN "status" DROP DEFAULT`);
    }

}
