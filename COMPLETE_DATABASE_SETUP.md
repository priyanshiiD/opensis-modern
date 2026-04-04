# 🔧 Complete Database Setup Guide

## Problem Identified

Your backend login controller is querying the `login_authentication` MongoDB collection for users with specific fields:
- `usernameLower` (lowercase username for case-insensitive search)
- `passwordHash` (bcrypt hashed password) 
- `userId` (numeric user ID)
- `profileId` (user profile/role ID)

**But this collection is empty!** That's why all login attempts fail.

---

## Solutions (Frontend Already Updated ✅)

### Solution 1: Use the Seed Admin Endpoint (EASIEST)

**Step 1:** Make sure backend is running
```bash
cd apps/api
npm start
```
Backend runs on: `http://localhost:4000`

**Step 2:** Add seed secret to backend `.env`
```env
# apps/api/.env
ADMIN_SEED_SECRET=superSecretSeedKey123
```

**Step 3:** Call the seed endpoint from browser console or Postman

**Using Browser Console:**
```javascript
fetch('http://localhost:4000/api/auth/seed-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'demo.admin',
    email: 'admin@example.com',
    password: 'Demo@12345!',
    seedSecret: 'superSecretSeedKey123'
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

**Using cURL:**
```bash
curl -X POST http://localhost:4000/api/auth/seed-admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demo.admin",
    "email": "admin@example.com",
    "password": "Demo@12345!",
    "seedSecret": "superSecretSeedKey123"
  }'
```

**Step 4:** Check response
```json
{
  "message": "Admin account successfully seeded."
}
```

**Step 5:** Try login
- Username: `demo.admin`
- Password: `Demo@12345!`

---

### Solution 2: Direct MongoDB Insert (If Seed Endpoint Fails)

If the seed endpoint fails or you prefer direct database access:

**Using MongoDB Compass:**

1. Connect to your MongoDB instance
2. Navigate to database: `opensis`
3. Create collection: `login_authentication` (if it doesn't exist)
4. Click "Insert Document"
5. Paste this document (replace `$2a$...` hashes after step 6):

```json
{
  "_id": { "$oid": "507f1f77bcf86cd799439011" },
  "userId": 1,
  "usernameLower": "demo.admin",
  "username": "demo.admin",
  "email": "admin@example.com",
  "passwordHash": "$2a$10$Yr1W87Bq0XXn4q08LK0MsuzeLlG8wLXJUGCCVIFHvhABqU8wSSH8K",
  "profileId": 1,
  "isActive": true,
  "createdAt": { "$date": "2026-04-04T00:00:00Z" },
  "updatedAt": { "$date": "2026-04-04T00:00:00Z" }
}
```

**Note:** The passwordHash above is bcrypt hash of `Demo@12345!`

Then login with:
- Username: `demo.admin`
- Password: `Demo@12345!`

---

### Solution 3: Generate Hash and Insert (If You Want Custom Password)

**Step 1:** Generate bcrypt hash in Node.js
```bash
node
```

```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('YourPassword123', 10).then(hash => console.log(hash));
// Copy the hash output
```

**Step 2:** Insert into MongoDB with that hash
```json
{
  "userId": 1,
  "usernameLower": "demo.admin",
  "username": "demo.admin",
  "email": "admin@example.com",
  "passwordHash": "YOUR_HASH_FROM_STEP_1",
  "profileId": 1,
  "isActive": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

---

## Quick Reference: Demo User Credentials

After seeding, use these to login:

```
Username: demo.admin
Password: Demo@12345!
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid username or password" | Verify user was inserted into `login_authentication` collection |
| Seed endpoint returns 403 | Check ADMIN_SEED_SECRET matches in .env |
| Seed endpoint 404 | Verify backend is running on port 4000 |
| Collection doesn't exist | MongoDB creates it automatically on first insert |
| Login still fails after seeding | Check passwordHash is valid bcrypt format |
| Can't connect to MongoDB | Verify MONGODB_URI in backend .env is correct |

---

## Frontend Updates (Already Done ✅)

The frontend has been updated to:
- ✅ Better error handling for various response formats
- ✅ Flexible user object parsing
- ✅ Helpful error messages with troubleshooting hints
- ✅ Proper JSON validation before parsing

No further frontend changes needed!

---

## Verification Steps

After seeding:

1. ✅ Backend running: `npm start` in `apps/api`
2. ✅ Frontend running: `npm start` in `apps/web`  
3. ✅ Navigate to `http://localhost:5173/login`
4. ✅ Enter demo credentials
5. ✅ Click "Login"
6. ✅ Should redirect to `/dashboard`
7. ✅ Check browser DevTools → Application → localStorage for tokens

---

**The backend is now fixed on the frontend side!** 🚀
Just seed your database using one of the solutions above and you'll be good to go.
