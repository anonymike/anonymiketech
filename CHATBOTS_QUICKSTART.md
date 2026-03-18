# AI Chatbots Platform - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Set Up Environment Variables

Add to `.env.local`:
```env
# Payflow M-Pesa API (for coin purchases)
PAYFLOW_API_KEY=your-api-key
PAYFLOW_API_SECRET=your-api-secret
PAYFLOW_PAYMENT_ACCOUNT_ID=your-account-id
```

*Note: Supabase variables should already be configured*

### Step 2: Run Database Migration

```bash
# Using Node.js
node scripts/chatbots-db-setup.js
```

This creates all tables, indexes, and sample bot types.

### Step 3: Start the Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000/chatbots-ai`

### Step 4: Test the Platform

1. **Sign Up:** Click "Get Started" → Create account
2. **Buy Coins:** Dashboard → Buy Coins → Select package → Complete M-Pesa
3. **Deploy Bot:** Deploy New Bot → Select type → Enter name → Deploy
4. **Manage Bots:** View in Active Bots → Start/Stop/Delete

## 📁 Key Files

| File | Purpose |
|------|---------|
| `/app/chatbots-ai/page.tsx` | Landing page |
| `/app/chatbots-ai/dashboard/page.tsx` | User dashboard |
| `/app/api/chatbots/*` | API endpoints |
| `/components/Chatbot*.tsx` | UI components |
| `/lib/supabase-chatbots-service.ts` | Database operations |
| `scripts/chatbots-db-setup.js` | Database setup |

## 🔑 Environment Variables Needed

```env
# Supabase (verify these are set)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Payflow M-Pesa
PAYFLOW_API_KEY=your-key
PAYFLOW_API_SECRET=your-secret
PAYFLOW_PAYMENT_ACCOUNT_ID=your-id
```

## 🧪 Test Scenarios

### Scenario 1: User Registration & Login
```
1. Visit /chatbots-ai
2. Click "Get Started Now"
3. Click "Sign up"
4. Enter email, username, password
5. Create account
6. Automatically redirected to dashboard
```

### Scenario 2: Purchase Coins (Sandbox)
```
1. On dashboard, click "Buy Coins"
2. Select "Medium" (60 coins, 500 KES)
3. Enter phone: 254712345678
4. Click "Pay 500 KES"
5. Complete M-Pesa (sandbox - auto-completes)
6. Coins credited to account
```

### Scenario 3: Deploy Bot
```
1. Go to "Deploy New Bot" tab
2. Select "WhatsApp Bot Pro" (10 coins)
3. Enter name: "My Test Bot"
4. Click "Deploy Bot"
5. Wait for success
6. Bot appears in "Active Bots"
```

### Scenario 4: Manage Bot
```
1. In Active Bots, find your bot
2. Click "Stop" to deactivate
3. Click "Start" to reactivate
4. Click "..." → Delete to remove
```

## 🔧 API Endpoints Reference

### Auth
```bash
# Sign up
POST /api/chatbots/auth/signup
{ email, password, username, phoneNumber }

# Login
POST /api/chatbots/auth/login
{ email, password }
```

### Bots
```bash
# List bots
GET /api/chatbots/bots
Headers: Authorization: Bearer {token}

# Deploy bot
POST /api/chatbots/bots
{ botTypeId, botName, webhookUrl }

# Update status
PATCH /api/chatbots/bots/{id}/status
{ status: "active" | "stopped" }

# Delete bot
DELETE /api/chatbots/bots/{id}
```

### Coins
```bash
# Buy coins
POST /api/chatbots/coins/purchase
{ phone: "254XXXXXXXXX", packageKey: "small|medium|large" }
```

## 🎨 UI Components

- **ChatbotsAuthModal** - Login/signup interface
- **ChatbotCard** - Bot display with controls
- **ChatbotDeploymentForm** - Bot deployment form
- **ChatbotCoinPurchaseModal** - Coin purchase interface

## 📊 Database Schema

**chatbot_users**
```sql
id, auth_id, username, email, coin_balance, created_at
```

**chatbot_types**
```sql
id, name, description, cost_in_coins, features[], is_active
```

**deployed_bots**
```sql
id, user_id, bot_type_id, bot_name, session_id, status, created_at
```

**coin_transactions**
```sql
id, user_id, amount, transaction_type, status, m_pesa_reference, created_at
```

## 🚨 Troubleshooting

### "Unauthorized" on login
- Check token is in localStorage after login
- Verify Supabase URL and keys in .env.local

### Coin purchase fails
- Check Payflow credentials
- Verify phone format: 254XXXXXXXXX
- Try sandbox phone: 254712345678

### Bot deployment fails
- Ensure you have enough coins
- Check bot type exists
- Verify token is valid

### Database errors
- Run migration: `node scripts/chatbots-db-setup.js`
- Check Supabase connection
- Verify database credentials

## 📝 Testing Credentials

**Test User (after signup):**
- Email: test@example.com
- Password: Test123456
- Phone: 254712345678 (for M-Pesa)

**Sandbox M-Pesa:**
- Phone: 254712345678 (auto-completes payment)
- Amount: Any amount works in sandbox

## 🎯 Common Tasks

### View all transactions
```bash
# In Supabase SQL Editor
SELECT * FROM coin_transactions WHERE user_id = '{user_id}';
```

### Check active bots
```bash
# In Supabase SQL Editor
SELECT * FROM deployed_bots WHERE user_id = '{user_id}' AND status = 'active';
```

### Check user balance
```bash
# In Supabase SQL Editor
SELECT coin_balance FROM chatbot_users WHERE auth_id = '{auth_id}';
```

## 📞 Support

Need help?
1. Check CHATBOTS_SETUP.md for detailed docs
2. Review CHATBOTS_IMPLEMENTATION_SUMMARY.md for architecture
3. Check browser console for errors
4. Verify environment variables are set

## ✅ Quick Checklist

- [ ] .env.local has Payflow credentials
- [ ] Database migration ran successfully
- [ ] Dev server running (`npm run dev`)
- [ ] Can access /chatbots-ai
- [ ] Can sign up and login
- [ ] Can see bot types on dashboard
- [ ] Can purchase coins (sandbox)
- [ ] Can deploy bot with session ID

---

You're ready to go! Start with the "Test Scenarios" above to verify everything works.

**Need detailed documentation?** See `CHATBOTS_SETUP.md`
