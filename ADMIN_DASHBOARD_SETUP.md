# Admin Dashboard Setup Guide

## Overview
Your UPSC Mentorship application now has a complete admin dashboard with hardcoded admin credentials. The admin can login, view all users, manage mentorship applications, contact inquiries, call bookings, and payments.

## Features Implemented

### 1. **Admin Login Page** (`/admin-login`)
- Dedicated admin login page with professional UI
- Hardcoded credentials (cannot be changed without backend code modification)
- Secure token-based authentication
- Redirects to admin dashboard on successful login

### 2. **Admin Dashboard** (`/dashboard/admin`)
- **Real-time Data Display**: Shows all users and their details
- **Multiple Data Tabs**:
  - **Users**: All registered users with email, name, and role
  - **Mentorship Applications**: View and manage application statuses
  - **Contact Inquiries**: View and respond to inquiries
  - **Call Bookings**: Track all scheduled calls
  - **Payments**: Monitor all transactions and revenue
  
- **Features**:
  - Search/filter across all tables
  - Status updates for applications and inquiries
  - Real-time data refresh
  - Statistics cards showing key metrics
  - Logout functionality

### 3. **Admin Page** (`/admin`)
- Quick redirect to admin login or dashboard
- Automatically checks if user is already logged in

## How to Use

### Step 1: Start the Application
```bash
# Backend (C# .NET)
cd backend
dotnet run

# Frontend (Next.js)
cd frontend
npm run dev
```

### Step 2: Access Admin Dashboard
1. Navigate to: `http://localhost:3000/admin-login`
2. Enter credentials:
   - **Username**: `admin`
   - **Password**: `Admin@123`
3. Click "Access Admin Dashboard"
4. You'll be redirected to `/dashboard/admin`

### Step 3: View User Details
- On the admin dashboard, you'll see a "Users" tab by default
- All registered users are displayed in a table with:
  - First Name
  - Last Name
  - Email
  - Role (Student, Mentor, Admin)
  - Account Creation Date
- Use the search bar to find specific users

### Step 4: Manage Other Data
- Click on different tabs (Mentorship Apps, Contact Inquiries, etc.) to manage other data
- Use the search functionality to filter results
- Update statuses as needed
- Click the "Refresh Data" button to reload information

### Step 5: Logout
- Click the red "Logout" button in the top right corner
- You'll be redirected back to the admin login page

## File Structure

### Backend Files Created
```
backend/src/Application/Features/Auth/Commands/AdminLogin/
├── AdminLoginCommand.cs              (Command definition)
└── AdminLoginCommandHandler.cs        (Command handler with hardcoded credentials)
```

### Frontend Files Created/Modified
```
frontend/src/app/
├── (auth)/admin-login/
│   └── page.tsx                      (Admin login page)
├── admin/
│   └── page.tsx                      (Admin redirect page)
└── dashboard/admin/
    └── page.tsx                      (Modified with logout button)

frontend/src/middleware.ts             (Updated to allow /admin-login)
```

## Hardcoded Credentials

**Username**: `admin`  
**Password**: `Admin@123`

### Changing Credentials
If you want to change the admin credentials:

1. **Backend**: Edit `backend/src/Application/Features/Auth/Commands/AdminLogin/AdminLoginCommandHandler.cs`
   ```csharp
   private const string ADMIN_USERNAME = "your-new-username";
   private const string ADMIN_PASSWORD = "your-new-password";
   ```

2. **Frontend** (optional, for display only): Update the credentials shown in the admin-login page

## How It Works

1. **Admin submits login** at `/admin-login` with username and password
2. **Frontend sends** POST request to `/api/auth/admin-login`
3. **Backend validates** against hardcoded credentials
4. **If valid**, backend generates JWT token with `Admin` role
5. **Frontend stores** the JWT token in localStorage
6. **Admin is redirected** to `/dashboard/admin`
7. **Admin dashboard** fetches user data from `/api/admin/dashboard-data`
8. **Backend authorizes** using JWT token with Admin role check

## Security Notes

- ✅ **Passwords are hardcoded on backend** - Cannot be changed through UI
- ✅ **JWT tokens are used** - Session-based authentication
- ✅ **Backend validates Admin role** - All admin endpoints require Admin role
- ⚠️ **Credentials are plain text** - For development/testing only
- ⚠️ **Consider changing credentials regularly** - Edit in backend code

## Troubleshooting

### "Invalid admin credentials" error
- Check that you're using the exact credentials: `admin` / `Admin@123`
- Make sure the backend server is running

### "Not authenticated" error
- Ensure the backend is returning proper JWT tokens
- Check browser console for network errors

### Admin dashboard shows "Forbidden" error
- The JWT token might not include the Admin role
- Try logging out and logging in again
- Restart both frontend and backend servers

### Data not loading in dashboard
- Click "Refresh Data" button
- Check browser's Network tab for failed API requests
- Ensure the backend server is running

## Next Steps

1. **Customize credentials** by editing the backend handler
2. **Add more admin features** like user management, deletions, role changes
3. **Implement audit logs** to track admin actions
4. **Add rate limiting** to protect the admin login endpoint
5. **Implement 2FA** for additional security
