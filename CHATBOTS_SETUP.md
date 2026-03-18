# AI Chatbots SaaS Platform - Setup Guide

## Overview
This guide outlines the AI Chatbots SaaS platform implementation, including database setup, API routes, components, and deployment instructions.

## Prerequisites
- Next.js 16+ with App Router
- Supabase account (already configured)
- Payflow M-Pesa API credentials (for coin purchases)
- Node.js 18+ and npm/pnpm/yarn

## Architecture

### Database Tables (Supabase PostgreSQL)

1. **chatbot_users** - Extends Supabase auth
   - Stores user profiles and coin balances
   - Tracks total coins purchased

2. **chatbot_types** - Admin-controlled bot templates
   - 5 pre-configured bot types available
   - Cost in coins per deployment

3. **deployed_bots** - User bot instances
   - Links users to bot types
   - Tracks bot status and session IDs

4. **coin_transactions** - Payment tracking
   - Records all coin purchases and deployments
   - M-Pesa transaction references

All tables have Row Level Security (RLS) policies to ensure data privacy.

### API Routes Structure

```
/app/api/chatbots/
├── auth/
│   ├── signup/route.ts      # User registration
│   └── login/route.ts       # User authentication
├── users/
│   └── me/route.ts          # Get/update profile
├── bot-types/route.ts       # List available bot types
├── coins/
│   └── purchase/route.ts    # Initiate M-Pesa payment
└── bots/
    ├── route.ts             # List & deploy bots
    ├── [id]/route.ts        # Get & delete bot
    └── [id]/status/route.ts # Update bot status
```

### Frontend Routes

- `/chatbots-ai` - Landing page with features & pricing
- `/chatbots-ai/dashboard` - Protected user dashboard

### Components

- **ChatbotsAuthModal** - Login/signup form
- **ChatbotCard** - Individual bot display with controls
- **ChatbotDeploymentForm** - Bot type selection & deployment
- **ChatbotCoinPurchaseModal** - Coin purchase with M-Pesa
- **ChatbotsPromoBanner** - Marketing banner

## Setup Instructions

### 1. Database Migration

Execute the database setup script to create all tables, indexes, and RLS policies:

```bash
# Using Node.js script
node scripts/chatbots-db-setup.js

# Or run the SQL directly in Supabase SQL Editor
# Copy contents of scripts/chatbots-db-setup.sql
```

This will:
- Create all 4 tables with proper schemas
- Set up indexes for performance
- Enable Row Level Security
- Insert 5 sample bot types

### 2. Environment Variables

Ensure these are set in your `.env.local`:

```env
# Supabase (usually already configured)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Payflow M-Pesa API (for coin purchases)
PAYFLOW_API_KEY=your-api-key
PAYFLOW_API_SECRET=your-api-secret
PAYFLOW_PAYMENT_ACCOUNT_ID=your-account-id
```

### 3. Service Layer

The service layer (`lib/supabase-chatbots-service.ts`) provides database operations:

- User management functions
- Bot type fetching
- Bot deployment & status management
- Transaction recording

All functions include error handling and proper logging.

### 4. Authentication Flow

1. User signs up via `ChatbotsAuthModal`
2. Signup endpoint creates auth user + chatbot_user profile
3. Login returns JWT session token
4. Token stored in localStorage for API calls
5. Dashboard redirects unauthenticated users to landing page

### 5. Coin Purchase Flow

1. User clicks "Buy Coins" in dashboard
2. `ChatbotCoinPurchaseModal` opens
3. User selects package (10, 60, or 130 coins)
4. API calls `/api/chatbots/coins/purchase` endpoint
5. Payflow initiates M-Pesa STK Push
6. User completes payment on phone
7. Coins credited to account upon completion

### 6. Bot Deployment Flow

1. User navigates to "Deploy New Bot" tab
2. Selects bot type with cost display
3. Enters bot name and optional webhook URL
4. System checks coin balance
5. On confirmation, coins deducted and bot deployed
6. Session ID generated for WhatsApp integration
7. Bot appears in "Active Bots" tab

## Key Features

### Security
- Row Level Security ensures users can only access their own data
- Bearer token validation on all protected endpoints
- Service role key used only for admin operations
- Phone number validation for M-Pesa payments

### User Experience
- Glassmorphism design matching existing site theme
- Dark mode with cyan/purple neon accents
- Smooth animations with Framer Motion
- Responsive mobile design
- Loading and error states
- Success confirmations

### Bot Management
- Deploy multiple bot instances
- Start/stop bots without deletion
- View session IDs for integration
- Delete bots with confirmation
- Real-time status updates

## Testing

### Test Account Creation
1. Go to `/chatbots-ai`
2. Click "Get Started"
3. Sign up with email & password
4. Redirected to dashboard

### Test Coin Purchase (Sandbox)
1. Click "Buy Coins"
2. Select package
3. Enter phone: 254712345678 (sandbox)
4. Confirm payment
5. Coins credited (in sandbox mode)

### Test Bot Deployment
1. Ensure you have coins (buy if needed)
2. Go to "Deploy New Bot" tab
3. Select bot type
4. Enter bot name
5. Deploy (coins deducted)
6. Bot appears in Active Bots

## Troubleshooting

### Login/Signup Issues
- Check Supabase connection in `.env.local`
- Verify email format and password requirements (min 6 chars)
- Check browser console for detailed errors

### Coin Purchase Fails
- Verify Payflow credentials in env vars
- Check phone number format: must be 254XXXXXXXXX
- Ensure internet connection for M-Pesa
- Check Payflow API status

### Bot Deployment Fails
- Verify coin balance is sufficient
- Check bot type exists in database
- Ensure token is valid and not expired
- Check API endpoint is reachable

## Production Deployment

### Pre-deployment Checklist
- [ ] Database backup created
- [ ] All env vars configured
- [ ] API endpoints tested with real M-Pesa
- [ ] Frontend fully tested on mobile
- [ ] Error handling and logging verified
- [ ] Rate limiting configured (if needed)

### Deployment Steps
1. Build: `npm run build`
2. Deploy to Vercel: `git push` (if connected)
3. Or run locally: `npm run dev`

### Post-deployment
- Monitor Supabase logs for errors
- Check M-Pesa transaction logs
- Monitor user signups and deployments
- Set up alerts for critical errors

## Customization

### Change Coin Packages
Edit `COIN_PACKAGES` in:
- `components/ChatbotCoinPurchaseModal.tsx`
- `app/api/chatbots/coins/purchase/route.ts`

### Change Bot Types
Add/modify bots in database via Supabase dashboard or update the seed data in migration script.

### Customize Styling
- Dark theme colors in `globals.css`
- Component styles use Tailwind with CSS variables
- Framer Motion animations can be tweaked per component

## API Documentation

### Authentication

**Signup**
```
POST /api/chatbots/auth/signup
Body: { email, password, username, phoneNumber? }
Returns: { user: { id, email, username } }
```

**Login**
```
POST /api/chatbots/auth/login
Body: { email, password }
Returns: { session: { access_token }, user: {...} }
```

### User Profile

**Get Profile**
```
GET /api/chatbots/users/me
Headers: Authorization: Bearer {token}
Returns: { data: { id, username, email, coin_balance } }
```

**Update Profile**
```
PATCH /api/chatbots/users/me
Headers: Authorization: Bearer {token}
Body: { username?, phone_number?, profile_image? }
Returns: { data: {...} }
```

### Bot Types

**List Bot Types**
```
GET /api/chatbots/bot-types
Returns: { data: [{ id, name, description, cost_in_coins, features }] }
```

### Bots

**List User Bots**
```
GET /api/chatbots/bots
Headers: Authorization: Bearer {token}
Returns: { data: [{ id, bot_name, status, session_id }] }
```

**Deploy Bot**
```
POST /api/chatbots/bots
Headers: Authorization: Bearer {token}
Body: { botTypeId, botName, webhookUrl? }
Returns: { data: { id, session_id }, remainingCoins }
```

**Update Bot Status**
```
PATCH /api/chatbots/bots/{id}/status
Headers: Authorization: Bearer {token}
Body: { status: "active" | "stopped" | "error" }
Returns: { data: {...} }
```

**Delete Bot**
```
DELETE /api/chatbots/bots/{id}
Headers: Authorization: Bearer {token}
Returns: { success: true }
```

### Coins

**Purchase Coins**
```
POST /api/chatbots/coins/purchase
Headers: Authorization: Bearer {token}
Body: { phone: "254XXXXXXXXX", packageKey: "small" | "medium" | "large" }
Returns: { checkoutRequestId, transactionId, coins, amount }
```

## Support & Issues

For issues or questions:
1. Check this guide first
2. Review error messages in browser console
3. Check Supabase dashboard for data issues
4. Contact support: support@anonymiketech.com

## Version History

- **v1.0** - Initial release with 5 bot types, M-Pesa integration, user dashboard
