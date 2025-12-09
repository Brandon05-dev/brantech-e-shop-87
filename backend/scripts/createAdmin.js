import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

// Load environment variables
dotenv.config();

/**
 * Create Admin User Script
 * Creates an admin user for testing the admin dashboard
 */
const createAdminUser = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('🔧 Creating admin user...\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@brantech.com' });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Name:', existingAdmin.name);
      console.log('🛡️  Role:', existingAdmin.role);
      console.log('\n💡 Use these credentials to login:');
      console.log('   Email: admin@brantech.com');
      console.log('   Password: admin123');
      process.exit(0);
    }

    // Create new admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@brantech.com',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'admin',
      phone: '+254 712 345 678',
      isEmailVerified: true,
      address: {
        street: '123 Admin Street',
        city: 'Nairobi',
        county: 'Nairobi County',
        postalCode: '00100'
      }
    });

    console.log('✅ Admin user created successfully!\n');
    console.log('📋 Admin Details:');
    console.log('   ID:', adminUser._id);
    console.log('   Name:', adminUser.name);
    console.log('   Email:', adminUser.email);
    console.log('   Role:', adminUser.role);
    console.log('\n🔐 Login Credentials:');
    console.log('   Email: admin@brantech.com');
    console.log('   Password: admin123');
    console.log('\n🌐 Access admin panel at:');
    console.log('   http://localhost:8080/admin/login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

// Run the script
createAdminUser();
