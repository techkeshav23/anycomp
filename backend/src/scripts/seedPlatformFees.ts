/**
 * Script to seed platform fee tiers
 * Run with: npx ts-node src/scripts/seedPlatformFees.ts
 */

import 'dotenv/config';
import { AppDataSource } from '../data-source';
import PlatformFee from '../entity/PlatformFee';
import { IPlatformFee, TierName } from '../types';

interface FeeTier {
  tier_name: TierName;
  min_value: number;
  max_value: number | null;
  platform_fee_percentage: number;
}

const seedPlatformFees = async (): Promise<void> => {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const platformFeeRepository = AppDataSource.getRepository(PlatformFee);

    // Check if fees already exist
    const existingFees = await platformFeeRepository.count();
    if (existingFees > 0) {
      console.log('⚠️  Platform fees already exist. Skipping seed.');
      process.exit(0);
    }

    // Platform fee tiers
    const feeTiers: FeeTier[] = [
      {
        tier_name: 'basic',
        min_value: 0,
        max_value: 1000,
        platform_fee_percentage: 5.00,
      },
      {
        tier_name: 'standard',
        min_value: 1001,
        max_value: 5000,
        platform_fee_percentage: 4.00,
      },
      {
        tier_name: 'premium',
        min_value: 5001,
        max_value: 10000,
        platform_fee_percentage: 3.00,
      },
      {
        tier_name: 'enterprise',
        min_value: 10001,
        max_value: null, // No upper limit
        platform_fee_percentage: 2.00,
      },
    ];

    // Insert fee tiers
    for (const tier of feeTiers) {
      const fee = platformFeeRepository.create(tier as Partial<IPlatformFee>);
      await platformFeeRepository.save(fee);
      console.log(`✅ Created tier: ${tier.tier_name} (${tier.platform_fee_percentage}%)`);
    }

    console.log('\n✅ Platform fees seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding platform fees:', (error as Error).message);
    process.exit(1);
  }
};

seedPlatformFees();
