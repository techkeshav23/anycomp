/**
 * Script to reset the database (drop all tables)
 * WARNING: This will delete ALL data!
 * Run with: npx ts-node src/scripts/resetDatabase.ts
 */

import 'dotenv/config';
import { Client } from 'pg';

const resetDatabase = async (): Promise<void> => {
  // Create a direct PostgreSQL connection (not through TypeORM)
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✅ Database connected');

    console.log('🗑️  Dropping all tables...');

    // Drop all tables with CASCADE (handles foreign keys automatically)
    await client.query('DROP TABLE IF EXISTS "media" CASCADE');
    console.log('   ✓ Dropped media');

    await client.query('DROP TABLE IF EXISTS "service_offerings" CASCADE');
    console.log('   ✓ Dropped service_offerings');

    await client.query('DROP TABLE IF EXISTS "platform_fee" CASCADE');
    console.log('   ✓ Dropped platform_fee');

    await client.query('DROP TABLE IF EXISTS "platform_fees" CASCADE');
    console.log('   ✓ Dropped platform_fees (old)');

    await client.query('DROP TABLE IF EXISTS "specialists" CASCADE');
    console.log('   ✓ Dropped specialists');

    await client.query('DROP TABLE IF EXISTS "users" CASCADE');
    console.log('   ✓ Dropped users');

    // Drop TypeORM metadata table
    await client.query('DROP TABLE IF EXISTS "typeorm_metadata" CASCADE');
    console.log('   ✓ Dropped typeorm_metadata');

    // Drop custom enum types
    await client.query('DROP TYPE IF EXISTS "public"."specialists_verification_status_enum" CASCADE');
    await client.query('DROP TYPE IF EXISTS "public"."platform_fee_tier_name_enum" CASCADE');
    await client.query('DROP TYPE IF EXISTS "public"."media_mime_type_enum" CASCADE');
    await client.query('DROP TYPE IF EXISTS "public"."media_media_type_enum" CASCADE');
    console.log('   ✓ Dropped enum types');

    console.log('\n✅ Database reset complete!');
    console.log('\n📋 Next steps:');
    console.log('   1. Run: npm run dev (to recreate tables)');
    console.log('   2. Run: npm run script:admin');
    console.log('   3. Run: npm run script:seed');

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', (error as Error).message);
    await client.end();
    process.exit(1);
  }
};

resetDatabase();
