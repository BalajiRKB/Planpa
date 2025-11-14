// Demo Data Seeder for PlanPA
// Run this script to create a demo account in your MongoDB database

import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/planpa';

async function seedDemoUser() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('planpa');
    const usersCollection = db.collection('users');

    // Check if demo user already exists
    const existingUser = await usersCollection.findOne({ email: 'demo@planpa.app' });
    
    if (existingUser) {
      console.log('Demo user already exists!');
      return;
    }

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    const demoUser = {
      userId: 'demo-user-001',
      email: 'demo@planpa.app',
      name: 'Demo User',
      password: hashedPassword,
      preferences: {
        defaultWorkDuration: 40,
        defaultBreakDuration: 5,
        timezone: 'UTC',
        notifications: true,
      },
      createdAt: new Date(),
    };

    await usersCollection.insertOne(demoUser);
    console.log('✅ Demo user created successfully!');
    console.log('Email: demo@planpa.app');
    console.log('Password: demo123');
  } catch (error) {
    console.error('Error seeding demo user:', error);
  } finally {
    await client.close();
  }
}

seedDemoUser();
