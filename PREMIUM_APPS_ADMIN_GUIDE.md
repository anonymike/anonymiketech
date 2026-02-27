# Premium Apps Admin Panel - Setup & Usage Guide

## Overview
The Premium Apps Admin Panel is a complete management system for creating, editing, and managing premium app listings. All changes made in the admin panel are automatically reflected on the premium apps store page visible to customers.

## Architecture

### Data Storage
- **Storage Method**: localStorage (Client-side)
- **Data File**: `/lib/premium-apps-data.ts`
- **Service Layer**: `/lib/premium-apps-service.ts`

### Key Components

#### 1. **Admin Panel Component** (`/components/AdminPremiumAppsPanel.tsx`)
- Full CRUD operations for premium apps
- Image upload functionality
- Mark apps as "NEW" or "OFFER"
- Set offer prices for discount promotions
- Manage download counts and features
- Real-time updates across the app

#### 2. **Service Layer** (`/lib/premium-apps-service.ts`)
Functions available:
- `getPremiumApps()` - Fetch all premium apps
- `getPremiumApp(id)` - Get single app by ID
- `createPremiumApp(app)` - Create new app
- `updatePremiumApp(id, updates)` - Update existing app
- `deletePremiumApp(id)` - Delete an app

#### 3. **Data Model** (`/lib/premium-apps-data.ts`)
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
  isNew?: boolean        // Mark as new release
  isOffer?: boolean      // Has active offer/discount
  offerPrice?: number    // Discounted price
}
```

## How to Use

### Accessing the Admin Panel
1. Navigate to `/admin`
2. Log in with your admin password
3. Click on "Premium Apps" in the sidebar or tab menu

### Creating a New App
1. Click "Add New App" button
2. Fill in all required fields:
   - **App Name** - Display name of the app
   - **Category** - Type of app (Messaging, Entertainment, etc.)
   - **Icon** - Single emoji representing the app
   - **Price** - Default price in KSH
   - **Description** - Short one-liner
   - **Long Description** - Detailed explanation
   - **Features** - One per line, displayed in the store
   - **Image** - Upload app screenshot/preview image
   - **Downloads** - Initial download count (for social proof)
3. Optionally mark as "NEW" or set an offer
4. Click "Create App"

### Editing an App
1. Find the app in the list
2. Click "Edit" button
3. Modify any fields
4. Click "Update App"
5. Changes appear instantly on the premium apps store

### Setting Up Offers
1. Edit the app
2. Check "Has Offer" checkbox
3. Enter the **Offer Price** (must be less than regular price)
4. The app card will show both prices with strikethrough original

### Marking as New
1. Edit the app
2. Check "Mark as New" checkbox
3. A "NEW" badge appears on the app card in the store

### Deleting an App
1. Find the app in the list
2. Click "Delete" button
3. Confirm deletion

## How Changes Reflect to Customers

### Real-Time Sync
All changes in the admin panel are stored in localStorage and immediately reflect on the `/premium-apps` page through the service layer:

1. **Admin makes change** → Data saved to localStorage
2. **Premium apps page loads** → Fetches latest data via `getPremiumApps()`
3. **Instant UI update** → App displays updated information

### What Updates
- ✅ App names and descriptions
- ✅ Prices and offer prices
- ✅ Images and icons
- ✅ Features lists
- ✅ New badges
- ✅ Offer badges
- ✅ Download counts
- ✅ App deletion and creation

### No Page Refresh Needed
Customers don't need to refresh - if they have the page open, they'll see updates reflected in their app listings (if they refresh or navigate away and return).

## Integration with Admin Dashboard

### Location in Admin Panel
The Premium Apps manager is integrated into the main admin dashboard:
- **Sidebar Menu**: "Premium Apps" option
- **Tab Navigation**: "Premium Apps" tab in dashboard
- **Background Color**: Green hacker theme to match brand

### Tab Handling
When "Premium Apps" tab is active:
- Stats section shows all orders (similar to "All Orders" view)
- Premium apps management panel replaces the orders table
- Other tabs still accessible via sidebar or tab navigation

## File Structure
```
/lib
  ├── premium-apps-data.ts        (Interface & default data)
  └── premium-apps-service.ts     (Service functions)

/components
  └── AdminPremiumAppsPanel.tsx    (Admin panel component)

/app
  ├── admin/page.tsx              (Updated with premium apps tab)
  └── premium-apps/page.tsx       (Updated to use service)
```

## Technical Details

### localStorage Keys
- `premiumAppsData` - Stores array of all premium apps as JSON

### Data Initialization
When the page first loads:
1. Service checks if `premiumAppsData` exists in localStorage
2. If not found, initializes with default premium apps
3. If found, loads existing data

### Image Storage
Images are stored as Base64 data URLs in localStorage:
- Upload via file input
- Converted to data URL using FileReader
- Stored directly in app object
- Displayed via `<img src>` tags

## Best Practices

1. **Always fill required fields** - Marked with asterisks (*)
2. **Use clear descriptions** - Customers read these carefully
3. **Update download counts** - Shows social proof and legitimacy
4. **Manage offers strategically** - Only use when promoting
5. **Keep features relevant** - List actual benefits, not hype
6. **Test app cards** - Check how they look in the store after editing

## Troubleshooting

### Changes Not Appearing
- Check browser console for errors
- Ensure localStorage is enabled
- Try refreshing the premium apps page

### Image Not Uploading
- Use smaller image files (< 2MB recommended)
- Ensure file is in a supported format (PNG, JPG, GIF)
- Check browser console for FileReader errors

### Data Not Saving
- Verify you clicked "Create" or "Update" button
- Check success message appears
- Verify localStorage isn't full or disabled

## Future Enhancements
- Database integration (Supabase/Neon) for cloud persistence
- Image CDN integration (Vercel Blob)
- Bulk import/export functionality
- Analytics for premium app sales
- Customer reviews and ratings system
