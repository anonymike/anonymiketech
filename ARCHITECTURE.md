# Premium Apps System Architecture

## System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ADMIN USERS                              │         CUSTOMERS         │
│  ┌──────────────────────────┐            │      ┌──────────────────┐ │
│  │   Admin Dashboard        │            │      │ Premium Apps     │ │
│  │   /admin                 │            │      │ Store (/premium) │ │
│  │                          │            │      │                  │ │
│  │  ┌────────────────────┐ │            │      │ ┌──────────────┐ │ │
│  │  │ AdminSidebar       │ │            │      │ │ App Grid     │ │ │
│  │  │ - Dashboard        │ │            │      │ │ - Cards      │ │ │
│  │  │ - Services         │ │            │      │ │ - Badges     │ │ │
│  │  │ - Premium Apps ✨  │ │────┐      │      │ │ - Prices     │ │ │
│  │  │ - Website Orders   │ │    │      │      │ │ - Buy Buttons│ │ │
│  │  │ - Social Media     │ │    │      │      │ │              │ │ │
│  │  │ - Settings         │ │    │      │      │ └──────────────┘ │ │
│  │  └────────────────────┘ │    │      │      │                  │ │
│  │         ↓               │    │      │      │ NavbarResponsive │ │
│  │  ┌────────────────────┐ │    │      │      │ Test Tool ✨    │ │
│  │  │AdminPremiumApps    │ │    │      │      │ (👁️ icon)       │ │
│  │  │Panel               │ │    │      │      └──────────────────┘ │
│  │  │ - Create App       │ │    │      │                            │
│  │  │ - Edit App         │ │    │      │      ┌──────────────────┐ │
│  │  │ - Delete App       │ │    │      │      │ Payment Modal    │ │
│  │  │ - Upload Image     │ │    │      │      │ - Phone Input    │ │
│  │  │ - Set Badges       │ │    │      │      │ - M-Pesa         │ │
│  │  │ - Manage Pricing   │ │    │      │      │ - Validation     │ │
│  │  └────────────────────┘ │    │      │      └──────────────────┘ │
│  │                          │    │      │                            │
│  └──────────────────────────┘    │      │                            │
│                                  │      │                            │
└──────────────────────────────────┼──────┼────────────────────────────┘
                                   │      │
                    ┌──────────────┴──────┴──────────────┐
                    │   SERVICE LAYER (Supabase)         │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────▼──────────────────────┐
                    │  supabase-premium-apps-service.ts   │
                    │                                      │
                    │  • getPremiumAppsFromDB()            │
                    │  • createPremiumAppInDB()            │
                    │  • updatePremiumAppInDB()            │
                    │  • deletePremiumAppFromDB()          │
                    │  • formatDBPremiumApp()              │
                    │                                      │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────▼──────────────────────┐
                    │    DATABASE LAYER (Supabase)        │
                    │                                      │
                    │    PostgreSQL Table:                 │
                    │    premium_apps                      │
                    │    ├─ id (UUID)                      │
                    │    ├─ name                           │
                    │    ├─ description                    │
                    │    ├─ long_description               │
                    │    ├─ category                       │
                    │    ├─ icon                           │
                    │    ├─ image (Base64)                 │
                    │    ├─ price                          │
                    │    ├─ offer_price                    │
                    │    ├─ is_new                         │
                    │    ├─ is_offer                       │
                    │    ├─ features (array)               │
                    │    ├─ downloads                      │
                    │    ├─ created_at                     │
                    │    └─ updated_at                     │
                    │                                      │
                    └────────────────────────────────────┘
```

---

## Component Hierarchy

```
AdminSidebar
├─ Menu Item: Dashboard
├─ Menu Item: Services
├─ Menu Item: Premium Apps ✨ (New)
│  └─ onClick → setActiveTab("premium-apps")
├─ Menu Item: Website Orders
├─ Menu Item: Social Media Orders
└─ Menu Item: Settings

Admin Page (/admin)
├─ AdminSidebar (sidebar navigation)
├─ Tab Buttons (all, website, social-media, services, premium-apps ✨)
├─ Stats Grid (revenue, orders, etc.)
├─ Content Sections
│  ├─ When activeTab === "all" → Dashboard
│  ├─ When activeTab === "website" → WebsiteOrders
│  ├─ When activeTab === "social-media" → SocialMediaOrders
│  ├─ When activeTab === "services" → AdminServicesPanel
│  └─ When activeTab === "premium-apps" ✨ → AdminPremiumAppsPanel
│
└─ Footer

AdminPremiumAppsPanel ✨
├─ Header (title, stats)
├─ New App Form (hidden by default)
│  ├─ Name Input
│  ├─ Description Input
│  ├─ Long Description Input
│  ├─ Category Input
│  ├─ Icon Input
│  ├─ Price Input
│  ├─ Offer Price Input
│  ├─ Features Input
│  ├─ Image Upload
│  ├─ Is New Checkbox
│  ├─ Is Offer Checkbox
│  └─ Save Button
│
├─ Apps List
│  └─ App Card (repeating)
│     ├─ App Details
│     ├─ Edit Button (✏️)
│     ├─ Delete Button (🗑️)
│     └─ Image Preview
│
└─ Message Display (success/error)

Premium Apps Page (/premium-apps)
├─ MatrixRain (background effect)
├─ MobileMenu (hamburger menu)
├─ DesktopNavbar (includes Premium Apps link)
├─ Hero Section
│  ├─ Title
│  ├─ Description
│  └─ Stats Grid
├─ Apps Grid
│  └─ App Card (repeating from Supabase)
│     ├─ Badges (NEW/OFFER)
│     ├─ Icon
│     ├─ Name
│     ├─ Description
│     ├─ Category Badge
│     ├─ Features List
│     ├─ Download Count
│     └─ Price & Buy Button
├─ Features Section
│  └─ Feature Cards (static)
├─ Payment Modal
│  ├─ Phone Input
│  ├─ Payment Status
│  └─ Transaction Code
├─ Footer
└─ NavbarResponsiveTest ✨ (floating 👁️ button)
   ├─ Device Selector
   │  ├─ Mobile (375×812)
   │  ├─ Tablet (768×1024)
   │  └─ Desktop (1920×1080)
   └─ Live Preview (iframe)
```

---

## Data Flow Diagram

### Create/Update Flow
```
User Input (Admin Form)
    ↓
Form Validation
    ↓
Click Save Button
    ↓
handleSave() triggered
    ↓
setLoading(true)
    ↓
If Editing:
  └─ updatePremiumAppInDB(id, data)
Else:
  └─ createPremiumAppInDB(data)
    ↓
Supabase Client
    ↓
POST/UPDATE to database.premium_apps
    ↓
Database Update
    ↓
loadApps() reloads from database
    ↓
setPremiumApps(updatedApps)
    ↓
Component re-renders
    ↓
Success Message Shown (2 seconds)
    ↓
Form Resets
```

### Delete Flow
```
User Clicks Delete Icon (🗑️)
    ↓
confirm() dialog shows
    ↓
If Confirmed:
  └─ deletePremiumAppFromDB(id)
      ↓
      Supabase Client
      ↓
      DELETE from database.premium_apps
      ↓
      loadApps() reloads
      ↓
      Component re-renders
      ↓
      Success Message (2 seconds)
```

### Customer View Flow
```
User Visits /premium-apps
    ↓
useEffect triggers
    ↓
loadApps() called
    ↓
getPremiumAppsFromDB() executes
    ↓
Supabase Client
    ↓
SELECT * from database.premium_apps
    ↓
Data Retrieved
    ↓
Data Formatted (snake_case → camelCase)
    ↓
setPremiumApps(formattedData)
    ↓
Grid Renders with Apps
    ↓
User Sees:
├─ App Icons & Names
├─ NEW/OFFER Badges
├─ Regular or Discounted Prices
├─ Buy Buttons
└─ Images
```

### Navbar Test Flow
```
User Clicks 👁️ Icon on /premium-apps
    ↓
showTest toggles true
    ↓
Modal Opens (AnimatePresence)
    ↓
Device Selector Visible
    ↓
User Selects Device (mobile/tablet/desktop)
    ↓
selectedDevice updates
    ↓
Device Box Size Changes
    ↓
iframe src="/" loads
    ↓
Navbar Displays in Selected Size
    ↓
User Can:
├─ Scroll to see navbar behavior
├─ Switch devices to compare
└─ Close modal when done
```

---

## State Management

### Admin Page State
```typescript
state = {
  activeTab: "all" | "website" | "social-media" | "services" | "premium-apps"
  orders: Order[]
  // ... other admin state
}
```

### AdminPremiumAppsPanel State
```typescript
state = {
  apps: PremiumApp[]
  isAddingNew: boolean
  editingId: string | null
  formData: Partial<PremiumApp>
  loading: boolean
  message: { type: 'success' | 'error', text: string } | null
}
```

### Premium Apps Page State
```typescript
state = {
  premiumApps: PremiumApp[]
  selectedApp: PremiumApp | null
  isModalOpen: boolean
}
```

### NavbarResponsiveTest State
```typescript
state = {
  showTest: boolean
  selectedDevice: 'mobile' | 'tablet' | 'desktop'
}
```

---

## API & Service Layer

### Supabase Service Methods

```typescript
// Get all apps
getPremiumAppsFromDB(): Promise<PremiumApp[]>

// Get single app
getPremiumAppFromDB(id: string): Promise<PremiumApp | null>

// Create app
createPremiumAppInDB(app: Omit<PremiumApp, 'id'>): Promise<PremiumApp | null>

// Update app
updatePremiumAppInDB(id: string, updates: Partial<PremiumApp>): Promise<PremiumApp | null>

// Delete app
deletePremiumAppFromDB(id: string): Promise<boolean>

// Helper
formatDBPremiumApp(data: any): PremiumApp
```

---

## Type Definitions

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

---

## Technology Stack

### Frontend
- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)

### Backend/Database
- **Database**: Supabase (PostgreSQL)
- **Client Library**: @supabase/supabase-js
- **Authentication**: Supabase Auth (built-in)

### Development
- **Package Manager**: npm/pnpm/yarn
- **Testing**: Manual testing + browser DevTools

---

## Security Architecture

```
Public Endpoints
├─ GET /premium-apps (customer store)
└─ Static images/assets

Protected Endpoints
├─ /admin (requires authentication)
│  └─ AdminPremiumAppsPanel (CRUD operations)
└─ API Routes (if needed future expansion)

Supabase RLS (Optional)
├─ Public read access for premium_apps
├─ Authenticated user insert/update/delete
└─ Admin role verification
```

---

## Performance Optimizations

1. **Image Optimization**
   - Base64 encoding for images
   - Lazy loading on grid

2. **Database Queries**
   - Efficient SELECT statements
   - Indexed columns (id, created_at)
   - Minimal data transfer

3. **Frontend Rendering**
   - Component memoization (Framer Motion)
   - Conditional rendering
   - Lazy loaded modals

4. **Caching**
   - Local state management
   - Minimal re-renders

---

## Scalability Considerations

- **Database**: Supabase auto-scales with PostgreSQL
- **Storage**: Base64 images can be moved to Vercel Blob Storage if needed
- **API**: Next.js API routes auto-scale on Vercel
- **Users**: No single point of failure

---

This architecture provides a robust, scalable foundation for managing and displaying premium apps!
