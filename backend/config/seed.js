const bcrypt = require('bcrypt');
const User = require('../models/User');

const seedDatabase = async () => {
  try {
    // Assuming the database connection is already established

    console.log('Seeding users...');

    // Clear existing users
    await User.deleteMany({});

    console.log('Existing users cleared.');

    // Seed users with password hashing
    const users = await User.insertMany([
      {
        fullName: 'Admin User',
        email: 'admin@admin.com',
        password: await bcrypt.hash('123456', 10),
        role: 'admin',
        age: 35,
        height: 175,
        weight: 70,
        dietPreference: 'keto',
        goal: 'maintain',
        status: 'active',
      },
      {
        fullName: 'Test User 1',
        email: 'test1@test.com',
        password: await bcrypt.hash('123456', 10),
        role: 'user',
        age: 28,
        height: 180,
        weight: 75,
        dietPreference: 'vegan',
        goal: 'gain',
        status: 'active',
      },
      {
        fullName: 'Test User 2',
        email: 'test2@test.com',
        password: await bcrypt.hash('123456', 10),
        role: 'user',
        age: 30,
        height: 170,
        weight: 80,
        dietPreference: 'vegetarian',
        goal: 'lose',
        status: 'active',
      },
      {
        fullName: 'Content Manager',
        email: 'content@test.com',
        password: await bcrypt.hash('123456', 10),
        role: 'content-manager',
        age: 25,
        height: 160,
        weight: 60,
        dietPreference: 'mediterranean',
        goal: 'maintain',
        status: 'active',
      },
    ]);

    console.log('Users seeded:', users.map(u => u.fullName));

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
};

module.exports = { seedDatabase };
