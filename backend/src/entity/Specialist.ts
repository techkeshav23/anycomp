import { EntitySchema } from 'typeorm';
import { ISpecialist } from '../types';

const Specialist = new EntitySchema<ISpecialist>({
  name: 'Specialist',
  tableName: 'specialists',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    // Service info (same as boss's schema)
    title: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    slug: {
      type: 'varchar',
      length: 255,
      unique: true,
      nullable: true,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    // Pricing
    base_price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      default: 0,
    },
    platform_fee: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      default: 0,
    },
    final_price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      default: 0,
    },
    // Ratings
    average_rating: {
      type: 'decimal',
      precision: 3,
      scale: 2,
      default: 0,
      nullable: true,
    },
    total_number_of_ratings: {
      type: 'int',
      default: 0,
    },
    // Status
    is_draft: {
      type: 'boolean',
      default: true,
    },
    verification_status: {
      type: 'enum',
      enum: ['pending', 'approved', 'under_review', 'rejected'],
      default: 'pending',
    },
    is_verified: {
      type: 'boolean',
      default: false,
    },
    duration_days: {
      type: 'int',
      default: 1,
    },
    // Timestamps
    created_at: {
      type: 'timestamp',
      createDate: true,
    },
    updated_at: {
      type: 'timestamp',
      updateDate: true,
    },
    deleted_at: {
      type: 'timestamp',
      nullable: true,
      deleteDate: true,
    },
  },
  relations: {
    // No user relation - standalone entity managed by admin
    media: {
      type: 'one-to-many',
      target: 'Media',
      inverseSide: 'specialist',
      cascade: true,
    },
    serviceOfferings: {
      type: 'one-to-many',
      target: 'ServiceOffering',
      inverseSide: 'specialist',
      cascade: true,
    },
  },
});

export default Specialist;
