/**
 * Script to create an admin user
 * Run with: npx ts-node src/scripts/createAdmin.ts
 */

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../data-source';
import User from '../entity/User';
import { IUser } from '../types';

const createAdmin = async (): Promise<void> => {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const userRepository = AppDataSource.getRepository(User);

    // Admin credentials - CHANGE THESE!
    const adminData = {
      name: 'Keshav Upadhyay',
      email: 'keshav@anycomp.com',
      password: 'Keshav1616', // Change this to a secure password
      role: 'admin' as const,
    };

    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: adminData.email },
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email:', adminData.email);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    const admin = userRepository.create({
      name: adminData.name,
      email: adminData.email.toLowerCase(),
      password: hashedPassword,
      role: adminData.role,
    } as Partial<IUser>);

    await userRepository.save(admin);

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('\n⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', (error as Error).message);
    process.exit(1);
  }
};

createAdmin();
