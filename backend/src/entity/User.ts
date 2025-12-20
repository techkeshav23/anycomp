import { EntitySchema } from 'typeorm';
import { IUser } from '../types';

const User = new EntitySchema<IUser>({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    name: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    email: {
      type: 'varchar',
      length: 255,
      unique: true,
      nullable: false,
    },
    password: {
      type: 'varchar',
      length: 255,
      nullable: false,
      select: false, // Don't return password by default
    },
    phone: {
      type: 'varchar',
      length: 20,
      nullable: true,
    },
    role: {
      type: 'enum',
      enum: ['specialist', 'admin'],
      default: 'specialist',
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp',
      updateDate: true,
    },
  },
  relations: {
    // 1:1 relationship with Specialist (only for role = 'specialist')
    specialist: {
      type: 'one-to-one',
      target: 'Specialist',
      inverseSide: 'user',
      cascade: true,
    },
  },
});

export default User;
