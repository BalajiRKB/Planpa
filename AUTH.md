# Authentication Guide for PlanPA

## 🔐 Authentication System

PlanPA uses **JWT (JSON Web Tokens)** for secure user authentication with client-side token storage.

## Features

- ✅ User registration with email/password
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcryptjs
- ✅ Protected routes with automatic redirect
- ✅ Persistent sessions with localStorage
- ✅ Logout functionality
- ✅ Demo account for testing

## Pages

### Landing Page
- **URL:** `/landing`
- Public marketing page with features and CTAs
- Links to login and signup

### Login Page
- **URL:** `/login`
- Email and password authentication
- Demo account quick-fill button
- Error handling and validation
- Automatic redirect to main app after login

### Signup Page
- **URL:** `/signup`
- User registration form
- Password confirmation
- Minimum 6 character password requirement
- Automatic login after successful registration

### Main App
- **URL:** `/`
- Protected by authentication
- Automatically redirects to `/login` if not authenticated
- Displays user name in header
- Logout button

## How Authentication Works

### 1. Registration Flow
```
User fills signup form → POST /api/auth/register → Hash password → 
Create user in MongoDB → Generate JWT → Store token + user in localStorage → 
Redirect to main app
```

### 2. Login Flow
```
User fills login form → POST /api/auth/login → Verify password → 
Generate JWT → Store token + user in localStorage → Redirect to main app
```

### 3. Protected Route Flow
```
User accesses / → ProtectedRoute checks localStorage → 
If no token: redirect to /login → If token exists: render main app
```

### 4. Logout Flow
```
User clicks Logout → Clear localStorage (token + user) → 
Redirect to /login
```

## Storage

Authentication data is stored in **localStorage**:

```javascript
// Stored items
localStorage.setItem('token', jwtToken);
localStorage.setItem('user', JSON.stringify(userData));

// Retrieved by
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
```

## Demo Account

For testing, use the demo account:

- **Email:** demo@planpa.app
- **Password:** demo123

To create the demo user in your database:

```bash
# Make sure MongoDB is running and MONGODB_URI is set
npx tsx scripts/seed-demo-user.ts
```

## API Endpoints

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "userId": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "preferences": { ... }
  },
  "token": "jwt-token-here"
}
```

### POST /api/auth/login
Login existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": { ... },
  "token": "jwt-token-here"
}
```

## Security Features

1. **Password Hashing:** Passwords are hashed with bcryptjs (10 salt rounds)
2. **JWT Tokens:** 7-day expiration, signed with JWT_SECRET
3. **Protected Routes:** Client-side route protection with automatic redirect
4. **Secure Storage:** Tokens stored in localStorage (consider httpOnly cookies for production)

## Environment Variables

Add to `.env.local`:

```bash
JWT_SECRET=your-super-secret-jwt-key-change-in-production
MONGODB_URI=mongodb+srv://...
```

## Components

### useAuth Hook
Location: `src/hooks/useAuth.ts`

Provides authentication state and methods:
```typescript
const { user, loading, logout, isAuthenticated, setUser } = useAuth();
```

### ProtectedRoute Component
Location: `app/components/ProtectedRoute.tsx`

Wraps protected pages:
```tsx
<ProtectedRoute>
  <YourProtectedContent />
</ProtectedRoute>
```

## Security Considerations for Production

⚠️ **Current Implementation:** Client-side only (localStorage)

🔒 **Production Recommendations:**
1. Use **httpOnly cookies** instead of localStorage
2. Implement **refresh tokens** for better security
3. Add **CSRF protection**
4. Use **HTTPS only** in production
5. Implement **rate limiting** on auth endpoints
6. Add **email verification** for new accounts
7. Implement **password reset** functionality
8. Add **2FA (Two-Factor Authentication)**

## Testing

### Manual Testing Flow

1. Visit `/signup` and create an account
2. You should be automatically logged in and redirected to `/`
3. Click **Logout** button
4. You should be redirected to `/login`
5. Login with your credentials
6. Access should be granted to main app

### Test Demo Account

1. Visit `/login`
2. Click **"Use Demo Account"** button
3. Form auto-fills with demo credentials
4. Click **"Sign In"**

## Troubleshooting

### "Unauthorized" errors
- Check MongoDB connection (MONGODB_URI)
- Verify JWT_SECRET is set
- Check if token is stored in localStorage

### Automatic logout on refresh
- Check localStorage for token and user
- Verify token hasn't expired (7-day default)
- Check browser console for errors

### Can't create account
- Verify MongoDB is running
- Check if user already exists
- Verify password meets requirements (min 6 chars)

---

Authentication system is ready! Push your changes and start testing.
