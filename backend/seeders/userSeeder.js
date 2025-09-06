const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const users = [
  {
    username: 'john_doe',
    email: 'john.doe@email.com',
    password: 'user123',
    fullName: 'John Doe',
    contactNumber: '+94771234567',
    address: {
      street: '123 Main Street',
      city: 'Colombo',
      location: 'Colombo'
    },
    pets: [
      {
        name: 'Buddy',
        type: 'Dog',
        breed: 'Golden Retriever',
        age: 3,
        weight: 25
      }
    ]
  },
  {
    username: 'jane_smith',
    email: 'jane.smith@email.com',
    password: 'user123',
    fullName: 'Jane Smith',
    contactNumber: '+94772345678',
    address: {
      street: '456 Park Avenue',
      city: 'Nugegoda',
      location: 'Nugegoda'
    },
    pets: [
      {
        name: 'Whiskers',
        type: 'Cat',
        breed: 'Persian',
        age: 2,
        weight: 4
      },
      {
        name: 'Mittens',
        type: 'Cat',
        breed: 'Siamese',
        age: 1,
        weight: 3
      }
    ]
  },
  {
    username: 'mike_johnson',
    email: 'mike.johnson@email.com',
    password: 'user123',
    fullName: 'Michael Johnson',
    contactNumber: '+94773456789',
    address: {
      street: '789 Ocean Drive',
      city: 'Dehiwala',
      location: 'Dehiwala'
    },
    pets: [
      {
        name: 'Rex',
        type: 'Dog',
        breed: 'German Shepherd',
        age: 5,
        weight: 30
      }
    ]
  },
  {
    username: 'sarah_wilson',
    email: 'sarah.wilson@email.com',
    password: 'user123',
    fullName: 'Sarah Wilson',
    contactNumber: '+94774567890',
    address: {
      street: '321 Hill Street',
      city: 'Rajagiriya',
      location: 'Rajagiriya'
    },
    pets: [
      {
        name: 'Polly',
        type: 'Bird',
        breed: 'Cockatiel',
        age: 2,
        weight: 0.1
      }
    ]
  },
  {
    username: 'david_brown',
    email: 'david.brown@email.com',
    password: 'user123',
    fullName: 'David Brown',
    contactNumber: '+94775678901',
    address: {
      street: '654 Lake View',
      city: 'Battaramulla',
      location: 'Battaramulla'
    },
    pets: [
      {
        name: 'Max',
        type: 'Dog',
        breed: 'Labrador',
        age: 4,
        weight: 28
      }
    ]
  },
  {
    username: 'lisa_davis',
    email: 'lisa.davis@email.com',
    password: 'user123',
    fullName: 'Lisa Davis',
    contactNumber: '+94776789012',
    address: {
      street: '987 Garden Road',
      city: 'Malabe',
      location: 'Malabe'
    },
    pets: [
      {
        name: 'Luna',
        type: 'Cat',
        breed: 'Maine Coon',
        age: 3,
        weight: 6
      }
    ]
  },
  {
    username: 'alex_garcia',
    email: 'alex.garcia@email.com',
    password: 'user123',
    fullName: 'Alex Garcia',
    contactNumber: '+94777890123',
    address: {
      street: '147 Sunset Boulevard',
      city: 'Nugegoda',
      location: 'Nugegoda'
    },
    pets: [
      {
        name: 'Charlie',
        type: 'Dog',
        breed: 'Beagle',
        age: 2,
        weight: 15
      }
    ]
  },
  {
    username: 'emma_martinez',
    email: 'emma.martinez@email.com',
    password: 'user123',
    fullName: 'Emma Martinez',
    contactNumber: '+94778901234',
    address: {
      street: '258 Riverside Drive',
      city: 'Colombo',
      location: 'Colombo'
    },
    pets: [
      {
        name: 'Bella',
        type: 'Dog',
        breed: 'Poodle',
        age: 6,
        weight: 12
      },
      {
        name: 'Oscar',
        type: 'Cat',
        breed: 'British Shorthair',
        age: 4,
        weight: 5
      }
    ]
  },
  {
    username: 'ryan_lee',
    email: 'ryan.lee@email.com',
    password: 'user123',
    fullName: 'Ryan Lee',
    contactNumber: '+94779012345',
    address: {
      street: '369 Mountain View',
      city: 'Dehiwala',
      location: 'Dehiwala'
    },
    pets: [
      {
        name: 'Rocky',
        type: 'Dog',
        breed: 'Bulldog',
        age: 5,
        weight: 22
      }
    ]
  },
  {
    username: 'olivia_taylor',
    email: 'olivia.taylor@email.com',
    password: 'user123',
    fullName: 'Olivia Taylor',
    contactNumber: '+94770123456',
    address: {
      street: '741 Valley Road',
      city: 'Rajagiriya',
      location: 'Rajagiriya'
    },
    pets: [
      {
        name: 'Daisy',
        type: 'Other',
        breed: 'Rabbit',
        age: 1,
        weight: 2
      },
      {
        name: 'Milo',
        type: 'Cat',
        breed: 'Ragdoll',
        age: 3,
        weight: 7
      }
    ]
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding users');

    // Clear existing users (except admins)
    await User.deleteMany({ role: 'user' });
    console.log('Cleared existing users');

    // Insert new users one by one to trigger password hashing
    const insertedUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      insertedUsers.push(user);
    }
    console.log(`Successfully seeded ${insertedUsers.length} users`);

    console.log('\nSeeded Users:');
    insertedUsers.forEach(user => {
      const petNames = user.pets.map(pet => pet.name).join(', ');
      console.log(`- ${user.fullName} (${user.username}) - Pets: ${petNames || 'None'}`);
    });

  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

if (require.main === module) {
  seedUsers();
}

module.exports = seedUsers;