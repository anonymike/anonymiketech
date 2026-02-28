# Setting Up Premium Apps Table in Supabase

## Quick Setup (2 minutes)

The `premium_apps` table doesn't exist in your Supabase database. Follow these steps to create it:

### Step 1: Open Supabase Console
1. Go to [supabase.com](https://supabase.com) and log in to your project
2. Click on your project name
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Create the Table
Copy and paste this SQL into the SQL editor and click "Run":

```sql
-- Create premium_apps table
CREATE TABLE public.premium_apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  long_description TEXT,
  category VARCHAR(100),
  icon VARCHAR(10),
  image TEXT,
  price INTEGER NOT NULL,
  offer_price INTEGER,
  is_new BOOLEAN DEFAULT false,
  is_offer BOOLEAN DEFAULT false,
  features TEXT[] DEFAULT '{}',
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_premium_apps_category ON public.premium_apps(category);
CREATE INDEX idx_premium_apps_created_at ON public.premium_apps(created_at DESC);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE public.premium_apps ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "allow_public_read" ON public.premium_apps
  FOR SELECT USING (true);

-- Create policy to allow authenticated write access
CREATE POLICY "allow_authenticated_write" ON public.premium_apps
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "allow_authenticated_update" ON public.premium_apps
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "allow_authenticated_delete" ON public.premium_apps
  FOR DELETE USING (auth.role() = 'authenticated');
```

### Step 3: Verify Table Creation
After running the SQL:
1. Go to **Table Editor** in the sidebar
2. You should see `premium_apps` in the list of tables
3. Check that all columns are created correctly

### Step 4: Refresh Your App
1. Go back to your app and refresh the page
2. The error messages should be gone
3. You can now create, edit, and delete premium apps in the admin panel

---

## Manual Testing

To verify everything works:

1. **Go to Admin Panel**: Navigate to `/admin`
2. **Click Premium Apps Tab**: Select "Premium Apps" from the sidebar
3. **Create a Test App**: Click "New App" and fill in the form
4. **Check Premium Apps Page**: Go to `/premium-apps` and you should see your new app

---

## If You Get an Authentication Error

If you see authentication errors, you may need to adjust the RLS policies:

1. Go to **Authentication** → **Policies** in Supabase
2. Find `premium_apps` table policies
3. Change policies to allow unauthenticated access temporarily:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "allow_public_read" ON public.premium_apps;
DROP POLICY IF EXISTS "allow_authenticated_write" ON public.premium_apps;
DROP POLICY IF EXISTS "allow_authenticated_update" ON public.premium_apps;
DROP POLICY IF EXISTS "allow_authenticated_delete" ON public.premium_apps;

-- Create new policies allowing all access (for development)
CREATE POLICY "allow_all_read" ON public.premium_apps FOR SELECT USING (true);
CREATE POLICY "allow_all_write" ON public.premium_apps FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON public.premium_apps FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete" ON public.premium_apps FOR DELETE USING (true);
```

---

## Troubleshooting

### "Could not find the table 'public.premium_apps'"
- The table wasn't created successfully
- Verify the SQL ran without errors
- Check that you're in the right database

### Admin Panel Still Shows Error
- Clear your browser cache (Ctrl+Shift+Del)
- Refresh the page (F5)
- Check browser console for specific errors

### Can't Insert Data
- Check RLS policies are set correctly
- Verify you're logged in (if using authentication)
- Ensure all required fields are filled in the form

---

## Backing Up Data

After creating apps, back them up regularly:

1. Go to **SQL Editor** in Supabase
2. Run: `SELECT * FROM public.premium_apps;`
3. Copy the results and save to a file

---

For more help, see: [Supabase Documentation](https://supabase.com/docs)
