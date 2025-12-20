import { EntitySchema } from 'typeorm';
import { IPlatformFee } from '../types';

const PlatformFee = new EntitySchema<IPlatformFee>({
  name: 'PlatformFee',
  tableName: 'platform_fee',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    tier_name: {
      type: 'enum',
      enum: ['basic', 'standard', 'premium', 'enterprise'],
      default: 'basic',
    },
    min_value: {
      type: 'int',
      default: 0,
    },
    max_value: {
      type: 'int',
      nullable: true,
    },
    platform_fee_percentage: {
      type: 'decimal',
      precision: 5,
      scale: 2,
      default: 0,
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
    },
    updated_at: {
      type: 'timestamp',
      updateDate: true,
    },
  },
});

export default PlatformFee;
