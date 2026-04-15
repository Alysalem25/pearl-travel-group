# 🚀 QUICK START - TEST YOUR FIXES

## Step 1: Restart Your Server

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend  
cd client
npm run dev
```

---

## Step 2: Test Login Flow

### Open Browser DevTools Console

**Press:** F12 or Right-click → Inspect → Console tab

You should see these logs when you login:

```
[AuthContext] Initializing auth: { ... }
[hasPermission] No user
[AuthContext] Login successful, user data: {
  id: "...",
  name: "Ahmed",
  role: "head",
  permissions: ["manage_booked_flights", "manage_booked_programs", ...]
}
[AuthContext] User saved to context: {...}
```

---

## Step 3: Register Test User

**Use this in your REST client:**

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test Head",
  "email": "testhead@test.com",
  "password": "Password123",
  "number": "123456789",
  "role": "head",
  "permissions": [
    "manage_booked_programs",
    "manage_booked_flights",
    "manage_booked_transportation",
    "manage_booked_hotels",
    "manage_booked_cruises"
  ]
}
```

**Check console for:**
```
[Register Response] User registered successfully: {
  id: "...",
  role: "head",
  permissions: ["manage_booked_programs", ...]
}
[Login Response] User data being sent to frontend: {...}
```

---

## Step 4: Test Navigation After Login

1. **Go to:** http://localhost:3000/Admindashbord/flights

2. **Watch console for logs:**
   ```
   [ProtectedRoute] Permission Check: {
     requiredPermission: "manage_booked_flights",
     userPermissions: ["manage_booked_flights", ...],
     hasPermissionResult: true,  ✅ Should be TRUE
     userId: "...",
     userRole: "head"
   }
   [ProtectedRoute] Permission result: true
   ```

3. **Expected:** Page LOADS with flights data

---

## Step 5: Test Permission Denied

1. Register different user with role="head" but WITHOUT "manage_booked_flights":

```http
POST http://localhost:5000/api/auth/register
{
  "name": "Limited Head",
  "email": "limited@test.com",
  "password": "Password123",
  "number": "987654321",
  "role": "head",
  "permissions": [
    "manage_booked_programs"  // Only programs, NOT flights!
  ]
}
```

2. **Go to:** http://localhost:3000/Admindashbord/flights

3. **Watch console:**
   ```
   [ProtectedRoute] Permission Check: {
     requiredPermission: "manage_booked_flights",
     userPermissions: ["manage_booked_programs"],
     hasPermissionResult: false,  ❌ Should be FALSE
     userId: "...",
     userRole: "head"
   }
   [ProtectedRoute] No permission, redirecting to /
   ```

4. **Expected:** Redirects to home page (/)

---

## Step 6: Check localStorage

1. **Open DevTools:** F12
2. **Go to:** Application tab → Storage → localStorage
3. **Look for key:** `auth_user`
4. **Value should contain:**
   ```json
   {
     "id": "...",
     "name": "Test Head",
     "email": "testhead@test.com",
     "role": "head",
     "permissions": ["manage_booked_flights", "manage_booked_programs", ...]
   }
   ```

---

## 🎯 What Should Happen

| Test Case | Expected Result | Check |
|-----------|-----------------|-------|
| Login with correct permissions | ✅ Page loads | Console: `hasPermissionResult: true` |
| Navigate to protected page | ✅ Page loads | No redirect in URL |
| Login without permission | ✅ Page redirects to / | Console: `No permission, redirecting` |
| Refresh page while logged in | ✅ Still has permissions | Console: `Initializing auth: { hasToken: true ... }` |
| Logout | ✅ Permissions cleared | localStorage `auth_user` is gone |

---

## 🐛 If Something Goes Wrong

### Issue: Page redirects to / (not logged in)

**Check:**
1. Console: Is `[AuthContext] Login successful` showing?
2. localStorage: Does `auth_user` have permissions?
3. Network tab: Is `/api/auth/login` returning permissions?

**If permissions missing from backend response:**
- Backend issue - permissions not returned from login

**If permissions in backend but not frontend:**
- Frontend storage issue - check if saveAuthData() is called

---

### Issue: Page redirects to / (wrong permission)

**Check:**
1. Console: `[ProtectedRoute] Permission Check: { hasPermissionResult: false }`
2. Does `userPermissions` array include required permission?
3. Is the permission string exactly correct?

**Common mistakes:**
- `"manage_booked-flights"` vs `"manage_booked_flights"` (dash vs underscore)
- Case sensitivity: `"Manage_Booked_Flights"` vs `"manage_booked_flights"`

---

### Issue: Page loads but shouldn't (permission check broken)

**Check:**
1. Is ProtectedRoute being used?
2. Is requiredPermission prop set correctly?
3. Is hasPermission() returning true incorrectly?

**Debug:**
```typescript
// Add to ProtectedRoute to verify
console.log("User permissions:", user?.permissions);
console.log("Checking for:", requiredPermission);
console.log("Result:", user?.permissions?.includes(requiredPermission));
```

---

## ✅ Success Indicators

You'll know it's working when you see:

1. **Browser console shows permission logs** ✅
2. **User with correct permission can access page** ✅
3. **User without permission gets redirected** ✅
4. **localStorage has permissions array** ✅
5. **No console errors** ✅

---

## 📞 Share This If Still Broken

If it's still not working, please share:

1. **Browser console logs** (screenshot of all auth logs)
2. **Network tab** - what `/api/auth/login` returns
3. **localStorage content** - the `auth_user` value
4. **What page you're trying to access**
5. **What permission the user has**

This will help identify where in the flow the issue is!
