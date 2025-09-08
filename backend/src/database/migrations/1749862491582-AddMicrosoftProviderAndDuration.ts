import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMicrosoftProviderAndDuration1749862491582 implements MigrationInterface {
  name = 'AddMicrosoftProviderAndDuration1749862491582';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Safely add MICROSOFT to existing enum (does nothing if the value already exists)
    await queryRunner.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM pg_enum
              WHERE enumlabel = 'MICROSOFT'
              AND enumtypid = (
                  SELECT oid FROM pg_type WHERE typname = 'integrations_provider_enum'
              )
          ) THEN
              ALTER TYPE "public"."integrations_provider_enum" ADD VALUE 'MICROSOFT';
          END IF;
      END$$;
    `);

    // Add duration column (default 30) to the events table
    await queryRunner.query(
      `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "duration" integer NOT NULL DEFAULT 30`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove duration column if present
    await queryRunner.query(
      `ALTER TABLE "events" DROP COLUMN IF EXISTS "duration"`
    );

    // NOTE: PostgreSQL does not support removing individual enum values easily.
    // Therefore, the addition of 'MICROSOFT' to integrations_provider_enum is irreversible here.
  }
} 