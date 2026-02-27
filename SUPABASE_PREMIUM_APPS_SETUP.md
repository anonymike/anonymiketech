# Supabase Premium Apps Setup Guide

## Overview
This guide walks you through setting up and using the Supabase-integrated Premium Apps management system for your Anonymiketech application.

## Database Setup

### 1. Create Table in Supabase

Go to your Supabase project and create a new table `premium_apps` with the following schema:

```sql
CREATE TABLE premium_apps (
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
```

### 2. Enable Row Level Security (Optional)

For production, enable RLS on the `premium_apps` table:

```sql
ALTER TABLE premium_apps ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access" ON premium_apps
  FOR SELECT USING (true);

-- Allow authenticated users (admin) to insert, update, delete
CREATE POLICY "Admin insert" ON premium_apps
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update" ON premium_apps
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete" ON premium_apps
  FOR DELETE USING (auth.role() = 'authenticated');
```

## Application Structure

### Core Files

1. **`lib/supabase-premium-apps-service.ts`**
   - Supabase service layer with CRUD operations
   - Functions: `getPremiumAppsFromDB()`, `createPremiumAppInDB()`, `updatePremiumAppInDB()`, `deletePremiumAppFromDB()`
   - Handles database schema formatting

2. **`components/AdminPremiumAppsPanel.tsx`**
   - Admin panel for managing premium apps
   - Create, edit, delete apps
   - Image upload functionality
   - Badge management (NEW, OFFER)
   - Price management with offer pricing

3. **`app/premium-apps/page.tsx`**
   - Customer-facing premium apps store
   - Real-time data from Supabase
   - Responsive grid layout
   - Shopping cart functionality
   - Shows badges and offer prices

4. **`components/NavbarResponsiveTest.tsx`**
   - Navbar responsiveness testing tool
   - Test navbar across multiple devices (mobile, tablet, desktop)
   - Fixed button in bottom-right corner

## How to Use

### Admin Panel Access

1. Navigate to `/admin`
2. Click "Premium Apps" tab in the admin dashboard
3. Use the admin panel to:
   - **Create**: Click "New App" button
   - **Edit**: Click pencil icon on any app card
   - **Delete**: Click trash icon to remove an app
   - **Manage Features**: Add/remove app features
   - **Set Badges**: Mark as NEW or set OFFER pricing

### Adding a New Premium App

1. In the admin panel, click "New App"
2. Fill in the required fields:
   - **Name**: App name
   - **Description**: Short description
   - **Long Description**: Detailed description
   - **Category**: App category
   - **Icon**: Emoji icon
   - **Price**: Regular price (KSH)
   - **Features**: List of features (comma-separated)
3. Upload an image (optional)
4. Set badges if needed:
   - Check "Is New" for new releases
   - Check "Is Offer" and set "Offer Price" for discounts
5. Click "Save"

### Managing Offers

1. Edit an existing app
2. Check "Is Offer"
3. Enter the discount price in "Offer Price"
4. The badge automatically displays on the customer page

### Testing Navbar Responsiveness

1. Go to `/premium-apps` page
2. Click the eye icon (👁️) button in the bottom-right corner
3. Select a device (Mobile, Tablet, or Desktop)
4. View how the navbar responds at different screen sizes

## Data Structure

### PremiumApp Interface

```typescript
interface PremiumApp {
  id: string
  name: string
  description: string
  longDescription: string
  features: string[]
  price: number
  category: string
  icon: string
  image: string
  downloads: number
  isNew?: boolean
  isOffer?: boolean
  offerPrice?: number
}
```

## Features

✅ **Real-time Updates**: Changes in admin panel instantly appear on customer page  
✅ **Image Management**: Upload and store app images as Base64  
✅ **Pricing Control**: Set regular and promotional pricing  
✅ **Badge System**: Mark new releases and special offers  
✅ **Responsive Design**: Works on all devices  
✅ **Database Integration**: Supabase PostgreSQL for data persistence  
✅ **Error Handling**: Comprehensive error messages and logging  

## Environment Variables

Ensure these are set in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Troubleshooting

### Table Not Found Error
- Verify the table was created correctly in Supabase
- Check column names match the service layer

### Images Not Loading
- Ensure Base64 encoding is working properly
- Check browser console for errors
- Verify storage limits haven't been exceeded

### Admin Panel Not Showing
- Verify authentication is working
- Check that user has required permissions
- Ensure `AdminPremiumAppsPanel` is imported correctly

### Navbar Test Button Not Appearing
- Clear browser cache
- Verify `NavbarResponsiveTest` component is imported
- Check console for JavaScript errors

## Support

For issues or questions, refer to:
- Supabase Documentation: https://supabase.com/docs
- Admin Panel Guide: See `PREMIUM_APPS_ADMIN_GUIDE.md`
