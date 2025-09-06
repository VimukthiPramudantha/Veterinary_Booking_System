const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: 'admin@pawcare.com' },
        { role: 'admin' }
      ]
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Create admin user
    const adminUser = new User({
      username: 'pawcare-admin',
      email: 'admin@pawcare.com',
      password: '123123123',
      fullName: 'PawCare Administrator',
      contactNumber: '+94 11 234 5678',
      address: {
        street: 'Main Street',
        city: 'Colombo',
        location: 'Battaramulla'
      },
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully:');
    console.log('Email: admin@pawcare.com');
    console.log('Password: 123123123');
    console.log('Role: admin');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeder
if (require.main === module) {
  createAdminUser();
}

module.exports = createAdminUser;