# 🚀 Quick Start Guide - openSIS Authentication

## Prerequisites
- Node.js 16+ and npm
- MongoDB connection string (configured in `.env`)
- Backend and Frontend `.env` files configured

## 5-Minute Setup

### Step 1: Configure Environment Variables

**Backend** (`apps/api/.env`):
```env
PORT=4000
MONGODB_URI=your_mongodb_uri
MONGODB_DB=opensis
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
DEMO_USERNAME=demo.admin
DEMO_PASSWORD=Demo@12345!
```

**Frontend** (`apps/web/.env`):
```env
VITE_API_BASE_URL=http://localhost:4000
```

### Step 2: Install Dependencies

```bash
# Backend
cd apps/api
npm install

# Frontend
cd apps/web
npm install
```

### Step 3: Start Backend

```bash
cd apps/api
npm start
```
✅ Backend running on http://localhost:4000

### Step 4: Start Frontend (in new terminal)

```bash
cd apps/web
npm start
```
✅ Frontend running on http://localhost:5173

### Step 5: Test Login

1. Open browser: `http://localhost:5173/login`
2. Enter credentials:
   - Username: `demo.admin`
   - Password: `Demo@12345!`
3. Click **Login**
4. ✅ Redirected to Dashboard on success

## Authentication System Files

### Core Files
```
src/features/auth/
├── context/AuthContext.jsx          ← Auth state management
├── pages/LoginPage.jsx              ← Login UI
├── pages/LoginPage.module.css       ← Login styles
├── api/authApi.js                   ← API calls
├── storage/tokenStorage.js          ← Token management
└── hooks/useAuthForm.js             ← Form handling
```

### Integration
```
src/app/
├── App.jsx                          ← AuthProvider wrapper
└── ProtectedRoute.jsx               ← Route protection

src/
└── main.jsx                         ← BrowserRouter wrapper
```

## Key Features

✅ **JWT Authentication** - Access & refresh tokens  
✅ **AuthContext Hook** - Global auth state management  
✅ **Protected Routes** - Auto-redirect unauthenticated users  
✅ **Form Validation** - Real-time error messages  
✅ **Persistent Login** - Auto-login on page refresh  
✅ **Professional UI** - Matches original PHP design  
✅ **Responsive Design** - Mobile, tablet, desktop  
✅ **Error Handling** - Comprehensive user feedback  
✅ **Loading States** - Visual feedback during operations  

## API Endpoints

### Login
```
POST /api/auth/login
{
  "username": "string",
  "password": "string"
}

Response: {
  "accessToken": "JWT",
  "refreshToken": "JWT",
  "user": { userId, username, role, ... }
}
```

### Logout
```
POST /api/auth/logout
Authorization: Bearer {accessToken}
```

## Using the Auth System

### In Components
```javascript
import { useAuth } from './features/auth/context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  return (
    <>
      {isAuthenticated && <p>Hi {user.username}!</p>}
      <button onClick={logout}>Logout</button>
    </>
  );
}
```

### Protected Pages
```javascript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Making Authenticated API Calls
```javascript
const { getAccessToken } = useAuth();

const token = getAccessToken();
fetch('/api/students', {
  headers: { Authorization: `Bearer ${token}` }
});
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Login returns 404 | Check backend is running on port 4000 |
| "Cannot find module" | Verify file paths and imports |
| Tokens not persisting | Check localStorage is enabled in browser |
| Blank login page | Check console for errors, verify Vite build |
| Button disabled after login | Check for console errors, verify API response |

## Development Tips

### Enable Debug Mode
Open browser console:
```javascript
const auth = window.__auth; // (if exposed)
console.log(auth?.user);
```

### Monitor Network Requests
1. Open DevTools → Network tab
2. Filter by "XHR" requests
3. Watch `/api/auth/login` requests

### Check Tokens
DevTools → Application → Local Storage:
- `opensis_access_token`
- `opensis_refresh_token`

## Project Structure

```
opensis-modern-new/
├── apps/
│   ├── api/                  ← Backend (Express, MongoDB)
│   │   ├── src/
│   │   │   ├── controllers/  ← Route handlers
│   │   │   ├── models/       ← MongoDB schemas
│   │   │   └── utils/        ← Helper functions
│   │   └── .env
│   └── web/                  ← Frontend (React, Vite)
│       ├── src/
│       │   ├── features/auth/    ← Auth system
│       │   ├── features/dashboard/
│       │   ├── app/
│       │   └── shared/
│       ├── public/           ← Static assets
│       ├── index.html
│       └── .env
└── package.json
```

## Next Steps

1. **Customize User Roles** - Modify role definitions in backend
2. **Add More Pages** - Create protected routes for different features
3. **Enhance Validation** - Add password strength requirements
4. **Frontend Styling** - Customize form colors, fonts, layout
5. **API Integration** - Connect to student, course, attendance APIs
6. **Error Tracking** - Set up error logging/monitoring
7. **Testing** - Write unit & integration tests
8. **Production Deployment** - Deploy to live server

## Support

For issues with:
- **Authentication**: Check [README.md](./README.md)
- **Backend API**: Check `apps/api/src/controllers/authController.js`
- **Form Validation**: Check `LoginPage.jsx` validation logic
- **Styling**: Check `LoginPage.module.css`

---

**Ready to build? Start with Step 1 above!** 🎉
