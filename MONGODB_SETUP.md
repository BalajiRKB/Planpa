# MongoDB Setup Guide for PlanPA

## ✅ Connection Fixed!

The MongoDB connection error has been resolved. The issue was an improperly formatted MongoDB URI with special characters in the password.

## Common MongoDB Errors & Solutions

### 1. DNS Resolution Error (`querySrv ENODATA`)

**Error:**
```
querySrv ENODATA _mongodb._tcp.planpa
```

**Cause:** 
- Special characters in password not URL-encoded
- Incorrect URI format
- Missing or malformed cluster URL

**Solution:**
URL encode special characters in your password:
- `@` → `%40`
- `!` → `%21`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `^` → `%5E`
- `&` → `%26`
- `*` → `%2A`

**Example:**
```bash
# Wrong (if password contains @)
MONGODB_URI=mongodb+srv://user:pass@word@cluster0.mongodb.net/

# Correct
MONGODB_URI=mongodb+srv://user:pass%40word@cluster0.mongodb.net/
```

### 2. Authentication Failed

**Error:**
```
MongoServerError: Authentication failed
```

**Solutions:**
- Verify username and password are correct
- Check database user permissions in MongoDB Atlas
- Ensure user has read/write access to the database
- Wait 2-3 minutes after creating user (propagation time)

### 3. Network Connectivity

**Error:**
```
ENOTFOUND cluster0.mongodb.net
```

**Solutions:**
- Check internet connection
- Verify MongoDB Atlas cluster is running
- Add your IP address to Atlas IP whitelist (0.0.0.0/0 for all IPs)
- Check firewall settings

## Testing Your Connection

Run the test script:

```bash
node scripts/test-mongodb.mjs
```

Expected output:
```
🔍 Testing MongoDB connection...
📍 URI: mongodb+srv://username:****@cluster0...
⏳ Connecting to MongoDB...
✅ Connected successfully!
📊 Database: planpa
📁 Collections found: 0
🏓 Ping successful!
✨ All tests passed!
```

## MongoDB Atlas Setup

### 1. Create Free Cluster
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign up / Log in
3. Click "Create" → "Deploy a database"
4. Choose **M0 Free tier**
5. Select cloud provider and region
6. Click "Create Cluster"

### 2. Create Database User
1. Go to **Database Access** (Security section)
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Username: `rkbplanpa`
5. Password: Create a secure password
6. **Important:** Note your password (you'll need it for the URI)
7. Set role: **Atlas admin** or **Read and write to any database**
8. Click **Add User**

### 3. Whitelist IP Address
1. Go to **Network Access** (Security section)
2. Click **Add IP Address**
3. Either:
   - Click **Add Current IP Address** (for your IP only)
   - Enter `0.0.0.0/0` (allow from anywhere - for development)
4. Click **Confirm**

### 4. Get Connection String
1. Go to **Database** → **Connect**
2. Choose **Connect your application**
3. Driver: **Node.js** version **6.8 or later**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. **URL encode** any special characters in the password

### 5. Update .env.local

```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

Replace:
- `username` → your database username
- `password` → your URL-encoded password
- `cluster0.xxxxx.mongodb.net` → your cluster address

## .env.local Configuration

Complete `.env.local` file:

```bash
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://rkbplanpa:your-password-here@cluster0.zspmk3c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# App Configuration
NEXT_PUBLIC_DEFAULT_WORK=40
NEXT_PUBLIC_DEFAULT_BREAK=5
```

## Creating the Demo User

Once MongoDB is connected, seed the demo user:

```bash
npx tsx scripts/seed-demo-user.ts
```

This creates:
- **Email:** demo@planpa.app
- **Password:** demo123

## Database Collections

PlanPA uses these MongoDB collections:

- **users** - User accounts and preferences
- **tasks** - Task management
- **schedules** - Daily schedules
- **timeblocks** - 40/5 minute work/break blocks

Collections are created automatically when first used.

## Troubleshooting

### Connection works in test but fails in Next.js

1. Restart the Next.js dev server
2. Clear `.next` cache: `rm -rf .next`
3. Rebuild: `npm run build`

### Password contains special characters

Always URL encode them:

```javascript
// Example password: MyP@ss!2024
// Encoded: MyP%40ss%212024

const password = 'MyP@ss!2024';
const encoded = encodeURIComponent(password);
console.log(encoded); // MyP%40ss%212024
```

### Still having issues?

1. Check MongoDB Atlas dashboard - is cluster running?
2. Verify user exists in Database Access
3. Check Network Access whitelist
4. Try connecting with MongoDB Compass (GUI tool)
5. Review MongoDB Atlas connection troubleshooter

## Security Notes

⚠️ **Never commit .env.local to Git**
- Already in `.gitignore`
- Contains sensitive credentials
- Use environment variables in production

🔒 **Production Recommendations:**
- Use strong, unique JWT_SECRET
- Restrict MongoDB IP whitelist
- Enable MongoDB Atlas auditing
- Use connection pooling
- Enable SSL/TLS
- Set up MongoDB Atlas alerts

---

Your MongoDB connection is now working! You can start using PlanPA. 🎉
