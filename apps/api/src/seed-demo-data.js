import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDatabase, ensureIndexes } from './config/db.js';
import User from './models/user.model.js';
import Student from './models/student.model.js';
import Teacher from './models/teacher.model.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB;
const demoUsername = process.env.DEMO_USERNAME || 'demo.admin';
const demoPassword = process.env.DEMO_PASSWORD || 'Demo@12345!';
const demoProfileId = Number(process.env.DEMO_PROFILE_ID || 1);

if (!mongoUri || !mongoDbName) {
  throw new Error('Missing MongoDB configuration. Set MONGODB_URI and MONGODB_DB.');
}

async function run() {
  try {
    await connectDatabase();
    await ensureIndexes();
    const demoUsernameLower = demoUsername.trim().toLowerCase();

    const existingUser = await User.findOne({ usernameLower: demoUsernameLower }).lean();
    if (!existingUser) {
      const passwordHash = await bcrypt.hash(demoPassword, 10);
      await User.create({
        userId: 1,
        profileId: demoProfileId,
        username: demoUsername,
        passwordHash,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Seeded demo user: ${demoUsername}`);
    } else {
      console.log(`Demo user already exists: ${demoUsername}`);
    }

    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      await Student.insertMany([
        { studentId: 1001, firstName: 'Ava', lastName: 'Johnson', className: '10-A', status: 'Active' },
        { studentId: 1002, firstName: 'Noah', lastName: 'Patel', className: '9-B', status: 'Active' },
        { studentId: 1003, firstName: 'Mia', lastName: 'Smith', className: '8-C', status: 'Inactive' }
      ]);
      console.log('Seeded demo students');
    } else {
      console.log('Students already exist, skipping demo students seed');
    }

    const teacherCount = await Teacher.countDocuments();
    if (teacherCount === 0) {
      await Teacher.insertMany([
        { teacherId: 2001, firstName: 'Priya', lastName: 'Sharma', department: 'Science', subject: 'Physics', status: 'Active' },
        { teacherId: 2002, firstName: 'Arjun', lastName: 'Verma', department: 'Math', subject: 'Algebra', status: 'Active' }
      ]);
      console.log('Seeded demo teachers');
    } else {
      console.log('Teachers already exist, skipping demo teachers seed');
    }

    console.log('Demo seed completed');
  } catch (error) {
    throw error;
  }
}

run().catch((error) => {
  console.error('Demo seed failed:', error);
  process.exit(1);
});