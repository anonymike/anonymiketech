# Admin Panel - Services Management Guide

## Overview
The admin panel now includes a comprehensive Services Management system that allows you to dynamically manage social media services and their pricing tiers.

## Features Implemented

### 1. Admin Panel Access
- Navigate to `/admin` to access the admin dashboard
- Access via the admin icon in the desktop navbar or "Admin Panel" link in the mobile menu
- Password-protected (default: "ANONYMIKE2026")

### 2. Services Management Tab
In the admin panel, click on "Services Management" to access the services panel.

#### Create Services
- Click "Add Service" button
- Fill in:
  - **Service Name**: e.g., "Telegram", "X - Twitter", "WhatsApp"
  - **Icon/Emoji**: e.g., 📱, 𝕏, 💬
  - **Category**: Select from Popular, All Platforms, Free Services, or African Services
- Services are stored in Vercel Blob storage

#### Manage Sub-Services
Each service can have multiple sub-services (pricing tiers):

1. **Expand a service** by clicking on it
2. **Add Sub-Service**:
   - Enter sub-service name (e.g., "1000 Members", "5000 Followers")
   - Enter price in KSH
   - Click "Add"

3. **Delete Sub-Service**: Click the trash icon next to any sub-service

4. **Edit Service**: Click the edit icon to modify name, icon, or category

#### Delete Service
- Click the trash icon on any service card
- Confirm deletion

### 3. Social Media Boosting Page (User-Facing)
- Services and sub-services automatically appear on `/social-media-boosting`
- Users can view all available services
- Services are grouped by category
- Click on any service to see its sub-services and prices
- Users can place orders for specific sub-services

## Supported Services
The system comes pre-configured with:
- **Telegram** (Members, Views)
- **X - Twitter** (Followers, Likes)
- **WhatsApp** (Group Members, Status Views)
- **Spotify** (Plays, Followers)
- **Canva** (Views, Shares)
- **ChatGPT** (Premium Features)
- **African - Kenyan Services** (M-Pesa, Safaricom)

You can add more services anytime via the admin panel.

## API Endpoints

### Main Services API
- **GET** `/api/admin/services` - Retrieve all services
- **POST** `/api/admin/services` - Create new service
- **PUT** `/api/admin/services` - Update service
- **DELETE** `/api/admin/services` - Delete service

### Sub-Services API
- **POST** `/api/admin/services/[serviceId]/subservices` - Add sub-service
- **PUT** `/api/admin/services/[serviceId]/subservices` - Update sub-service
- **DELETE** `/api/admin/services/[serviceId]/subservices` - Delete sub-service

### Initialization
- **POST** `/api/admin/services/init` - Initialize with default services
- **GET** `/api/admin/services/init` - Check initialization status

## Database
Services are stored in **Vercel Blob** storage at `admin/services.json`.

Data structure:
```json
{
  "services": [
    {
      "id": "service-[timestamp]",
      "name": "Service Name",
      "icon": "📱",
      "category": "Popular",
      "subServices": [
        {
          "id": "subservice-[timestamp]",
          "name": "Sub-Service Name",
          "price": 500,
          "quantity": 0
        }
      ],
      "createdAt": "2026-02-19T...",
      "updatedAt": "2026-02-19T..."
    }
  ]
}
```

## User Experience Flow
1. User visits `/social-media-boosting`
2. Page fetches all services from `/api/admin/services`
3. Services are displayed grouped by category
4. User can search for specific services
5. Clicking a service shows its sub-services and prices
6. User can order a specific sub-service package

## Component Files

### Admin Components
- **`components/AdminServicesPanel.tsx`** - Full services management UI with CRUD operations

### User-Facing Components
- **`components/DynamicSocialServices.tsx`** - Dynamically displays services on social media page

### API Routes
- **`app/api/admin/services/route.ts`** - Main services CRUD operations
- **`app/api/admin/services/[serviceId]/subservices/route.ts`** - Sub-services management
- **`app/api/admin/services/init/route.ts`** - Service initialization and seeding

### Page Updates
- **`app/social-media-boosting/page.tsx`** - Updated to use DynamicSocialServices
- **`app/admin/page.tsx`** - Added Services Management tab
- **`components/DesktopNavbar.tsx`** - Added admin panel link
- **`components/MobileMenu.tsx`** - Added admin panel link

## Getting Started

### First Time Setup
1. Go to admin panel (`/admin`)
2. Login with admin password
3. Go to Services Management tab
4. The system will automatically load with default services

### Adding a New Service
1. Click "Add Service"
2. Fill in all required fields
3. Click "Create"
4. Expand the service and add sub-services
5. Changes appear instantly on the user-facing page

### Deleting a Service
1. Find the service in the list
2. Click the delete (trash) icon
3. Confirm deletion
4. Service is removed from both admin and user pages

## Features
- Full CRUD operations for services
- Sub-services with individual pricing
- Category-based organization
- Search functionality
- Real-time updates
- Persistent storage using Vercel Blob
- Responsive design (desktop and mobile)
- Admin authentication

## Future Enhancements
Potential additions:
- Order management for services
- Inventory tracking
- Discount codes
- Service analytics
- Bulk operations
- Service templates
