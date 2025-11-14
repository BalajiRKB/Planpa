#!/usr/bin/env node

/**
 * MongoDB Connection Test Script
 * Run: node scripts/test-mongodb.mjs
 */

import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../.env.local');

let MONGODB_URI;
try {
  const envFile = readFileSync(envPath, 'utf8');
  const uriMatch = envFile.match(/MONGODB_URI=(.+)/);
  MONGODB_URI = uriMatch ? uriMatch[1].trim() : null;
} catch (error) {
  console.error('❌ ERROR: Cannot read .env.local file');
  process.exit(1);
}

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

console.log('🔍 Testing MongoDB connection...');
console.log('📍 URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Hide password

async function testConnection() {
  let client;
  
  try {
    console.log('\n⏳ Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    console.log('✅ Connected successfully!');
    
    // Test database access
    const db = client.db('planpa');
    const collections = await db.listCollections().toArray();
    
    console.log('\n📊 Database: planpa');
    console.log(`📁 Collections found: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('   Collections:');
      collections.forEach(col => console.log(`   - ${col.name}`));
    }
    
    // Test ping
    await db.admin().ping();
    console.log('\n🏓 Ping successful!');
    
    console.log('\n✨ All tests passed! Your MongoDB connection is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('querySrv')) {
      console.error('\n💡 TIP: This looks like a DNS resolution error.');
      console.error('   - Check your MongoDB URI format');
      console.error('   - Ensure special characters in password are URL encoded');
      console.error('   - Example: @ should be %40, ! should be %21');
    } else if (error.message.includes('authentication failed')) {
      console.error('\n💡 TIP: Authentication failed.');
      console.error('   - Verify your username and password are correct');
      console.error('   - Check if the database user has proper permissions');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 TIP: Cannot resolve MongoDB host.');
      console.error('   - Check your internet connection');
      console.error('   - Verify the cluster URL is correct');
    }
    
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Connection closed.');
    }
  }
}

testConnection();
