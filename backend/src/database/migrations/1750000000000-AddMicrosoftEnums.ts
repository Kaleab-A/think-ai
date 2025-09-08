import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMicrosoftEnums1750000000000 implements MigrationInterface {
  name = 'AddMicrosoftEnums1750000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."integrations_app_type_enum" ADD VALUE IF NOT EXISTS 'MICROSOFT_TEAMS'`);
    await queryRunner.query(`ALTER TYPE "public"."events_locationtype_enum" ADD VALUE IF NOT EXISTS 'OUTLOOK_CALENDAR'`);
    await queryRunner.query(`ALTER TYPE "public"."events_locationtype_enum" ADD VALUE IF NOT EXISTS 'MICROSOFT_TEAMS'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // PostgreSQL does not support removing enum values easily; no-op.
  }
} 