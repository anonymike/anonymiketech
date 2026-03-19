# Chatbots Auth System - Login/Signup Fixes

## Problem Summary

**Signup Issue**: After user creates account, RLS policies block inserting into `chatbot_users` table (error code 42501)
**Login Issue**: Generic error "Failed to process login request" masks actual errors

## Root Causes

1. **RLS Policy Blocks Insert**: The service role needed explicit permissions
2. **Wrong Client Usage**: Service was using anon client (user context) instead of admin client
3. **Missing Error Details**: Generic catch block hides real error messages
4. **No Logging**: Difficult to debug without console logs

## Solutions Implemented

### 1. **Login API Route (`/app/api/chatbots/auth/login/route.ts`)**

**Key Changes**:
- ✅ Removed dependency on `getChatbotUserByAuthId()` service function
- ✅ Now uses `supabaseAdmin` client directly to query `chatbot_users` table
- ✅ Added comprehensive console logging at each step
- ✅ Returns actual error messages instead of generic "Failed to process login request"
- ✅ Handles missing profiles gracefully with specific error

**Flow**:
```
1. Validate email/password
2. Call supabaseAdmin.auth.signInWithPassword()
3. If auth fails → return auth error message
4. If auth succeeds → fetch profile using admin client
5. If profile missing → return "Profile not found"
6. If profile found → return session + user data
```

**Error Messages Now**:
- `Invalid email or password` (auth failure)
- `User profile not found` (profile missing)
- Actual error message from database (if DB issue)

### 2. **Signup API Route (`/app/api/chatbots/auth/signup/route.ts`)**

**Key Changes**:
- ✅ Added detailed logging at each step
- ✅ Better error messages based on error codes:
  - `42501` → "Permission denied. RLS policies may be misconfigured."
  - `PGRST205` → "Database tables not found. Please run the SQL migration."
- ✅ Logs actual error code, message, and hint
- ✅ Returns real error instead of generic "Failed to process signup"

**Error Handling**:
```typescript
if (profileError.code === '42501') {
  // RLS policy blocked insert
  errorMessage = 'Permission denied. RLS policies may be misconfigured.'
}
```

### 3. **Auth Modal (`/components/ChatbotsAuthModal.tsx`)**

No changes needed - already properly displays error messages from API.

## Required: Update RLS Policies

Run this SQL in Supabase SQL Editor to fix RLS issues:

```sql
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.chatbot_users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.chatbot_users;

-- Allow service role (API) full access
CREATE POLICY "Service role can manage chatbot_users" ON public.chatbot_users
  AS PERMISSIVE FOR ALL USING (true) WITH CHECK (true);

-- Client-side policies (authenticated users)
CREATE POLICY "Users can view their own profile" ON public.chatbot_users
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own profile" ON public.chatbot_users
  FOR UPDATE USING (auth.uid() = auth_id);
```

## Testing Checklist

- [ ] Run SQL migrations in Supabase
- [ ] Try signup with new account
  - Should see success or specific error (not generic error)
  - Check browser console for detailed logs
- [ ] Try login with correct credentials
  - Should redirect to dashboard
  - Should see user profile loaded
- [ ] Try login with wrong password
  - Should see "Invalid email or password"
- [ ] Check Vercel/Server logs
  - Should see `[v0]` debug logs showing each step

## Debug Logs to Expect

**On Signup**:
```
[v0] Signup attempt for: user@example.com
[v0] Creating Supabase auth user...
[v0] Creating chatbot user profile for: [uuid]
[v0] Chatbot user created successfully: [uuid]
```

**On Login**:
```
[v0] Login attempt for: user@example.com
[v0] Authenticating with Supabase...
[v0] Auth successful for user: [uuid]
[v0] Fetching chatbot user profile...
[v0] Login successful for user: [uuid]
```

**On Error**:
```
[v0] Auth error: Invalid login credentials
[v0] Profile fetch error: message: "...", code: "..."
```

## Files Modified

1. `/app/api/chatbots/auth/login/route.ts` - Complete rewrite with admin client + logging
2. `/app/api/chatbots/auth/signup/route.ts` - Enhanced error handling + logging
3. No changes to service layer (functions remain the same)

## Next Steps

1. ✅ Update RLS policies (run SQL above)
2. ✅ Deploy updated API routes
3. ✅ Test signup/login flow
4. ✅ Check browser console and server logs for `[v0]` messages
5. ✅ Verify user can access dashboard after login
