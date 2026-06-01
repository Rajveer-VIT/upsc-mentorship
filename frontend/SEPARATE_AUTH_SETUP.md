# Separate Authentication Setup - User vs Admin

## Overview
The application now has **completely separate authentication systems** for regular users and admin users. When you login as a user, logging in as admin won't affect your user session, and vice versa.

## Implementation Details

### 1. **Separate Zustand Stores**
- **User Store**: `src/store/useUserAuth.ts`
  - Stores: `user_accessToken`, `user_refreshToken`, `user_id`, `user_email`, `user_fullName`, `user_role`
  
- **Admin Store**: `src/store/useAdminAuth.ts`
  - Stores: `admin_accessToken`, `admin_refreshToken`, `admin_id`, `admin_email`, `admin_fullName`, `admin_username`

### 2. **Separate Local Storage Keys**
All keys are prefixed to avoid conflicts:

**User Keys:**
- `user_accessToken`
- `user_refreshToken`
- `user_id`
- `user_email`
- `user_fullName`
- `user_role`

**Admin Keys:**
- `admin_accessToken`
- `admin_refreshToken`
- `admin_id`
- `admin_email`
- `admin_fullName`
- `admin_username`

### 3. **Separate Cookies**
- **User Cookie**: `user_auth_token`
- **Admin Cookie**: `admin_auth_token`

### 4. **Updated Middleware** (`src/middleware.ts`)
The middleware now:
- Checks for `user_auth_token` for user-protected routes (`/dashboard`, `/profile`)
- Checks for `admin_auth_token` for admin-protected routes (`/dashboard/admin`, `/admin`)
- Prevents cross-session pollution (admin can't access user dashboard and vice versa)

### 5. **Login Pages**
- **User Login** (`src/app/(auth)/login/page.tsx`):
  - Uses `useUserAuth` store
  - Sets `user_auth_token` cookie
  - Redirects to `/dashboard` or custom redirect URL
  
- **Admin Login** (`src/app/(auth)/admin-login/page.tsx`):
  - Uses `useAdminAuth` store
  - Sets `admin_auth_token` cookie
  - Redirects to `/dashboard/admin`

### 6. **Auth Utilities** (`src/lib/auth-utils.ts`)
Helper functions:
- `logoutUser()` - Clears only user session
- `logoutAdmin()` - Clears only admin session
- `getUserToken()` - Get user token
- `getAdminToken()` - Get admin token
- `isUserAuthenticated()` - Check user auth status
- `isAdminAuthenticated()` - Check admin auth status

## Usage Examples

### Logout User (Without Affecting Admin Session)
```typescript
import { logoutUser } from '@/lib/auth-utils';
import { useRouter } from 'next/navigation';

function UserHeader() {
  const router = useRouter();

  const handleLogout = () => {
    logoutUser(router); // Only clears user auth
    // If admin was logged in, they remain logged in
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### Logout Admin (Without Affecting User Session)
```typescript
import { logoutAdmin } from '@/lib/auth-utils';
import { useRouter } from 'next/navigation';

function AdminHeader() {
  const router = useRouter();

  const handleLogout = () => {
    logoutAdmin(router); // Only clears admin auth
    // If user was logged in, they remain logged in
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### Get Current User/Admin
```typescript
import { useUserAuth } from '@/store/useUserAuth';
import { useAdminAuth } from '@/store/useAdminAuth';

function Dashboard() {
  const { fullName: userName } = useUserAuth();
  const { fullName: adminName } = useAdminAuth();

  return (
    <>
      <p>User: {userName}</p>
      <p>Admin: {adminName}</p>
    </>
  );
}
```

### Check Authentication Status
```typescript
import { isUserAuthenticated, isAdminAuthenticated } from '@/lib/auth-utils';

function App() {
  const userAuth = isUserAuthenticated();
  const adminAuth = isAdminAuthenticated();

  return (
    <>
      {userAuth && <p>User is logged in</p>}
      {adminAuth && <p>Admin is logged in</p>}
      {userAuth && adminAuth && <p>Both user and admin are logged in!</p>}
    </>
  );
}
```

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    SEPARATE AUTHENTICATION                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  USER LOGIN                          ADMIN LOGIN           │
│  ├─ POST /api/auth/login            ├─ POST /api/auth/admin-login
│  ├─ Store in user_accessToken       ├─ Store in admin_accessToken
│  ├─ Set user_auth_token cookie      ├─ Set admin_auth_token cookie
│  └─ Redirect to /dashboard          └─ Redirect to /dashboard/admin
│                                                             │
│  MIDDLEWARE CHECKS                                         │
│  ├─ User route? Check user_auth_token (independent)       │
│  └─ Admin route? Check admin_auth_token (independent)      │
│                                                             │
│  LOGOUT                                                    │
│  ├─ User logout: Only clear user_* keys                   │
│  └─ Admin logout: Only clear admin_* keys                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Files Modified

1. ✅ `src/store/useUserAuth.ts` - Created
2. ✅ `src/store/useAdminAuth.ts` - Created
3. ✅ `src/app/(auth)/login/page.tsx` - Updated to use useUserAuth
4. ✅ `src/app/(auth)/admin-login/page.tsx` - Updated to use useAdminAuth
5. ✅ `src/middleware.ts` - Updated to check separate tokens
6. ✅ `src/lib/auth-utils.ts` - Created with utility functions

## Next Steps

To use the separate authentication in your components:

1. **In user components**, import and use `useUserAuth`:
   ```typescript
   import { useUserAuth } from '@/store/useUserAuth';
   
   const { clearUserAuth } = useUserAuth();
   ```

2. **In admin components**, import and use `useAdminAuth`:
   ```typescript
   import { useAdminAuth } from '@/store/useAdminAuth';
   
   const { clearAdminAuth } = useAdminAuth();
   ```

3. **Update logout buttons** to use the separate functions from `auth-utils.ts`

4. **Backend API** should also validate tokens separately (ensure `/api/auth/admin-login` only accepts admin credentials)

## Testing

1. Login as user → user session is created ✅
2. Open new tab and login as admin → admin session is created ✅
3. Both sessions exist simultaneously ✅
4. User logout → only user session cleared, admin still logged in ✅
5. Admin logout → only admin session cleared, user still logged in ✅
