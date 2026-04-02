import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB;
const demoUsername = process.env.DEMO_USERNAME || 'demo.admin';
const demoPassword = process.env.DEMO_PASSWORD || 'Demo@12345!';
const demoProfileId = Number(process.env.DEMO_PROFILE_ID || 1);

if (!mongoUri || !mongoDbName) {
  throw new Error('Missing MongoDB configuration. Set MONGODB_URI and MONGODB_DB.');
}

const userCollectionName = 'login_authentication';
const studentCollectionName = 'students';
const refreshTokenCollectionName = 'auth_refresh_tokens';

async function run() {
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const database = client.db(mongoDbName);

    await Promise.all([
      database.collection(userCollectionName).createIndex({ usernameLower: 1 }, { unique: true }),
      database.collection(refreshTokenCollectionName).createIndex({ jti: 1 }, { unique: true }),
      database.collection(refreshTokenCollectionName).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      database.collection(studentCollectionName).createIndex({ studentId: -1 }, { unique: true })
    ]);

    const users = database.collection(userCollectionName);
    const students = database.collection(studentCollectionName);
    const demoUsernameLower = demoUsername.trim().toLowerCase();

    const existingUser = await users.findOne({ usernameLower: demoUsernameLower });
    if (!existingUser) {
      const passwordHash = await bcrypt.hash(demoPassword, 10);
      await users.insertOne({
        userId: 1,
        profileId: demoProfileId,
        username: demoUsername,
        usernameLower: demoUsernameLower,
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Seeded demo user: ${demoUsername}`);
    } else {
      console.log(`Demo user already exists: ${demoUsername}`);
    }

    const studentCount = await students.countDocuments();
    if (studentCount === 0) {
      await students.insertMany([
        { studentId: 1001, firstName: 'Ava', lastName: 'Johnson', createdAt: new Date() },
        { studentId: 1002, firstName: 'Noah', lastName: 'Patel', createdAt: new Date() },
        { studentId: 1003, firstName: 'Mia', lastName: 'Smith', createdAt: new Date() }
      ]);
      console.log('Seeded demo students');
    } else {
      console.log('Students already exist, skipping demo students seed');
    }

    console.log('Demo seed completed');
  } finally {
    await client.close();
  }
}

run().catch((error) => {
  console.error('Demo seed failed:', error);
  process.exit(1);
});