/**
 * Database Seeding Instructions for openSIS
 * 
 * The backend login function queries the 'login_authentication' collection
 * with specific field names that need to be present in MongoDB.
 * 
 * Run this from the backend terminal to seed demo data.
 */

// OPTION 1: Run this in MongoDB directly (Using MongoDB Compass or mongo shell)
// ============================================================================

/**
db.login_authentication.insertOne({
  userId: 1,
  usernameLower: "demo.admin",
  username: "demo.admin",
  email: "admin@example.com",
  passwordHash: "$2a$10$Yr1W87Bq0XXn....", // This is bcrypt hash of "Demo@12345!"
  profileId: 1,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
*/

// OPTION 2: Use the seed endpoint (if available)
// ============================================================================

/**
POST http://localhost:4000/api/auth/seed-admin
{
  "username": "demo.admin",
  "email": "admin@example.com", 
  "password": "Demo@12345!",
  "seedSecret": "your-seed-secret"
}
*/

// OPTION 3: Create users using Mongoose seedAdmin function
// ============================================================================

/**
POST http://localhost:4000/api/auth/seed-admin
{
  "username": "demo.admin",
  "email": "admin@example.com",
  "password": "Demo@12345!",
  "seedSecret": "your-seed-secret"
}
*/

console.log(`
╔════════════════════════════════════════════════════════════════╗
║          DATABASE SEEDING REQUIRED                             ║
╚════════════════════════════════════════════════════════════════╝

The backend login function expects users in 'login_authentication' collection
with fields: userId, usernameLower, username, email, passwordHash, profileId

QUICK FIX (Copy and paste in MongoDB Compass console):
═══════════════════════════════════════════════════════

const bcrypt = require('bcryptjs');

// Create password hash for "Demo@12345!"
const password = "Demo@12345!";
const salt = 10;

// Note: MongoDB Compass may not have bcryptjs available
// Instead, use the Node.js backend seed endpoint

═════════════════════════════════════════════════════════

BEST OPTION: Use Backend Seed Endpoint
═════════════════════════════════════════

1. Make sure backend is running:
   cd apps/api
   npm start

2. Set ADMIN_SEED_SECRET in .env:
   ADMIN_SEED_SECRET=your-secret-key

3. Call seed endpoint:
   POST http://localhost:4000/api/auth/seed-admin
   
   Body:
   {
     "username": "demo.admin",
     "email": "admin@example.com",
     "password": "Demo@12345!",
     "seedSecret": "your-secret-key"
   }

4. Then login with:
   Username: demo.admin
   Password: Demo@12345!

═════════════════════════════════════════════════════════
`);
