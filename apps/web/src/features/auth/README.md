# 🔐 OpenSIS Authentication System

Complete login and authentication implementation for the MERN stack openSIS application.

## 📋 Overview

This authentication system provides:

- **JWT-based Authentication**: Access tokens and refresh tokens for secure API communication
- **AuthContext & useAuth Hook**: Global authentication state management
- **Protected Routes**: Automatic redirection of unauthenticated users
- **Professional UI**: Login page matching the original PHP-based openSIS design
- **Form Validation**: Client-side validation with error messages
- **Loading States**: Visual feedback during login operations
- **Auto-login**: Token persistence and automatic re-login on page refresh
- **Error Handling**: Comprehensive error management and user feedback

## 🏗️ Architecture

### Components

#### 1. **AuthContext** (`features/auth/context/AuthContext.jsx`)
Central authentication state management using React Context API.

**Features:**
- User state management
- Login/logout functions
- Token storage and retrieval
- Authentication initialization
- Auto-login on page refresh

**Exports:**
- `AuthContext`: Context object
- `AuthProvider`: Provider component (wrap your app with this)
- `useAuth()`: Custom hook to access auth state

**Example Usage:**
```jsx
import { useAuth } from './features/auth/context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated, error, isLoading } = useAuth();
  
  return <div>{user?.username}</div>;
}
```

#### 2. **LoginPage** (`features/auth/pages/LoginPage.jsx`)
Professional login UI component matching the original PHP design.

**Features:**
- Username/Email input
- Password input
- Form validation
- Error display
- Loading state
- Auto-redirect on successful login
- Responsive design

**Styling:**
- Uses CSS Module (`LoginPage.module.css`)
- Blue gradient background
- Green login button
- Roboto font family
- Professional error messages

#### 3. **ProtectedRoute** (`app/ProtectedRoute.jsx`)
Route wrapper for authenticated pages.

**Features:**
- Automatic redirect to login if not authenticated
- Loading state during auth initialization
- Smooth transitions

#### 4. **AuthProvider Wrapper** (`app/App.jsx`)
Main application wrapper that provides authentication context to all routes.

### Data Flow

```
User Credentials (email/password)
        ↓
    LoginPage Form
        ↓
    useAuth(login)
        ↓
    loginRequest API Call → Backend
        ↓
    Backend validates & returns JWT tokens
        ↓
    AuthContext stores tokens + user state
        ↓
    Auto-redirect to Dashboard
```

## 🚀 Setup Instructions

### 1. **Environment Configuration**

**Web App** (`.env` in `apps/web/.env`):
```env
VITE_API_BASE_URL=http://localhost:4000
```

**Backend API** (`.env` in `apps/api/.env`):
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=opensis
JWT_ACCESS_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
DEMO_USERNAME=demo.admin
DEMO_PASSWORD=Demo@12345!
```

### 2. **Start the Backend Server**

```bash
cd apps/api
npm install
npm start
```

Server runs on `http://localhost:4000`

### 3. **Start the Frontend Development Server**

```bash
cd apps/web
npm install
npm start
```

Frontend runs on `http://localhost:5173` (Vite default)

### 4. **Test Login**

- Navigate to `http://localhost:5173/login`
- Use credentials from `.env` (e.g., `demo.admin` / `Demo@12345!`)
- On successful login, you'll be redirected to `/dashboard`

## 📁 File Structure

```
apps/web/src/
├── features/auth/
│   ├── context/
│   │   └── AuthContext.jsx          # Auth state management
│   ├── pages/
│   │   ├── LoginPage.jsx            # Login UI component
│   │   └── LoginPage.module.css     # Login styles
│   ├── api/
│   │   └── authApi.js               # API calls
│   ├── storage/
│   │   └── tokenStorage.js          # Token persistence
│   └── hooks/
│       └── useAuthForm.js            # Form handling hook
├── app/
│   ├── App.jsx                       # App with AuthProvider
│   └── ProtectedRoute.jsx            # Route protection
└── ...
```

## 🔑 API Integration

### Login Endpoint

**Request:**
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "username": "demo.admin",
  "password": "Demo@12345!"
}
```

**Response (Success):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "username": "demo.admin",
    "role": "admin",
    "profileId": 1,
    "permissions": ["view_all", "edit_all"]
  }
}
```

**Response (Error):**
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid username or password."
  }
}
```

### Logout Endpoint

**Request:**
```javascript
POST /api/auth/logout
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "refreshToken": "{refreshToken}"
}
```

## 🔐 Token Storage & Security

### Token Storage (localStorage)
- `opensis_access_token`: JWT access token (short-lived, ~15 minutes)
- `opensis_refresh_token`: JWT refresh token (long-lived, ~7 days)

### Security Considerations
- ✅ Tokens automatically cleared on logout
- ✅ Token persisted only for auto-login
- ✅ HttpOnly cookies recommended for production (future enhancement)
- ✅ JWT signature verification on backend

### Token Parsing (Client-side)
```javascript
// AuthContext automatically parses JWT to extract user info
const parts = accessToken.split('.');
const payload = JSON.parse(atob(parts[1]));
// payload contains: userId, username, role, profileId, permissions
```

## 🎨 UI/UX Features

### Login Form Validation

**Client-side Validation:**
- Username: Required, min 3 characters
- Password: Required, min 6 characters

**Real-time Validation:**
- Errors clear when user starts typing
- Touched state for showing errors only after interaction
- Server errors displayed clearly

### Visual States

1. **Empty State**: Clean form with placeholders
2. **Valid State**: Green checkmarks (optional enhancement)
3. **Error State**: Red borders with error messages
4. **Loading State**: Disabled inputs, animated spinner on button
5. **Success State**: Auto-redirect (no visible state)

### Responsive Design

- Mobile: Full-width layout, adjusted padding
- Tablet: 80-90% width with centered layout
- Desktop: 450px max-width with centered layout

## 🧪 Testing the Authentication Flow

### 1. **Manual Testing**

```bash
# Start backend
cd apps/api
npm start

# Start frontend (in new terminal)
cd apps/web
npm start
```

**Test Cases:**
- ✓ Login with valid credentials → Redirected to dashboard
- ✓ Login with invalid credentials → Error message shown
- ✓ Empty form submission → Validation errors shown
- ✓ Page refresh while logged in → Still authenticated
- ✓ Click logout → Redirected to login
- ✓ Try accessing /dashboard without login → Redirected to login

### 2. **Debug Mode**

Open browser console and test:
```javascript
// Access auth context in any component
const { user, getAccessToken, getRefreshToken } = useAuth();

// Check tokens
console.log(getAccessToken());
console.log(getRefreshToken());

// Check user
console.log(user);
```

### 3. **Browser DevTools**

**Application Tab:**
- Check `localStorage` for tokens
- Monitor under "Local Storage" → "http://localhost:5173"

**Network Tab:**
- Monitor POST requests to `/api/auth/login`
- Check response headers and body
- Verify JWT tokens in response

## 📚 Usage Examples

### Using useAuth Hook

```jsx
import { useAuth } from './features/auth/context/AuthContext';

function Dashboard() {
  const { user, logout, isLoading } = useAuth();

  if (!user) {
    return <div>Loading user...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Role: {user.role}</p>
      <button onClick={logout} disabled={isLoading}>
        {isLoading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}
```

### Protected Route Example

```jsx
import { ProtectedRoute } from './app/ProtectedRoute';
import { AdminPanel } from './features/admin/AdminPanel';

// In App.jsx
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminPanel />
    </ProtectedRoute>
  }
/>
```

### Making Authenticated API Calls

```jsx
import { useAuth } from './features/auth/context/AuthContext';

function StudentList() {
  const { getAccessToken } = useAuth();

  const fetchStudents = async () => {
    const token = getAccessToken();
    const response = await fetch('/api/students', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  };

  // Use in useEffect...
}
```

## 🛡️ Validation Rules

### Form Validation

| Field | Rules |
|-------|-------|
| Username | Required, Min 3 chars, Max 100 chars |
| Password | Required, Min 6 chars |

### Validation Errors

- **Empty Fields**: "Field is required"
- **Too Short**: "Must be at least X characters"
- **Invalid Format**: "Invalid format" (if email validation added)
- **Server Error**: "Invalid username or password"
- **Network Error**: "Could not connect to API"

## 🔄 Future Enhancements

1. **Remember Me Checkbox**: Extend token TTL
2. **Forgot Password Flow**: Password reset functionality
3. **Two-Factor Authentication**: Enhanced security
4. **OAuth Integration**: Google/GitHub login
5. **Token Refresh**: Automatic token rotation
6. **Social Login**: Integration with social providers
7. **Biometric Login**: Fingerprint/face recognition
8. **Account Lockout**: Rate limiting on failed attempts
9. **Login History**: Track login events
10. **Toast Notifications**: Success/error messages

## 🐛 Troubleshooting

### Issue: "Cannot find module 'AuthContext'"

**Solution:**
- Ensure `AuthContext.jsx` is created in `src/features/auth/context/`
- Check import path spelling

### Issue: Login returns 404 error

**Solution:**
- Verify backend is running: `npm start` in `apps/api`
- Check `VITE_API_BASE_URL` in `.env` points to correct backend (default: `http://localhost:4000`)
- Check backend routes are properly configured

### Issue: Token not persisting after refresh

**Solution:**
- Check browser localStorage is enabled
- Verify `setAuthTokens()` is being called after login
- Check tokens are being saved with correct keys

### Issue: "useAuth must be used inside AuthProvider"

**Solution:**
- Ensure `App.jsx` wraps routes with `<AuthProvider>`
- Only use `useAuth()` in components rendered inside `AuthProvider`

## 📖 Code Quality

- **Comments**: Comprehensive JSDoc comments on functions
- **Error Handling**: Try-catch blocks with meaningful error messages
- **State Management**: Centralized with Context API
- **Form Validation**: Real-time with touched state
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Semantic HTML, focus management

## 📄 License

Part of openSIS - Open Solutions for Education, Inc.

---

**Last Updated:** April 3, 2026
**Status:** ✅ Production Ready
