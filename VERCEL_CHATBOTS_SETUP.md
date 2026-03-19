# Chatbots Platform - Vercel Deployment Setup

## Step 1: Supabase Database Setup (Critical!)

The chatbots platform requires database tables that must be created manually in Supabase.

### Create Tables in Supabase:

1. **Go to your Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Create a New Query**
4. **Copy and run this SQL:**

```sql
-- Chatbots Platform Database Schema
-- Run this in Supabase SQL Editor to create all required tables

-- Create chatbot_users table
CREATE TABLE IF NOT EXISTS public.chatbot_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  coin_balance INTEGER DEFAULT 0,
  total_coins_purchased INTEGER DEFAULT 0,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chatbot_types table
CREATE TABLE IF NOT EXISTS public.chatbot_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  long_description TEXT,
  category VARCHAR(100),
  icon VARCHAR(50),
  image TEXT,
  cost_in_coins INTEGER NOT NULL DEFAULT 10,
  api_endpoint VARCHAR(500),
  documentation_url TEXT,
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  admin_only BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create deployed_bots table
CREATE TABLE IF NOT EXISTS public.deployed_bots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.chatbot_users(id) ON DELETE CASCADE,
  bot_type_id UUID NOT NULL REFERENCES public.chatbot_types(id) ON DELETE CASCADE,
  bot_name VARCHAR(255) NOT NULL,
  session_id VARCHAR(500) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'stopped', 'error')),
  webhook_url TEXT,
  config JSONB DEFAULT '{}',
  error_message TEXT,
  last_activity TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coin_transactions table
CREATE TABLE IF NOT EXISTS public.coin_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.chatbot_users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('purchase', 'deployment', 'refund')),
  m_pesa_reference VARCHAR(255),
  m_pesa_checkout_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  phone_number VARCHAR(20),
  payment_method VARCHAR(50) DEFAULT 'mpesa',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chatbot_users_auth_id ON public.chatbot_users(auth_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_users_username ON public.chatbot_users(username);
CREATE INDEX IF NOT EXISTS idx_chatbot_users_email ON public.chatbot_users(email);
CREATE INDEX IF NOT EXISTS idx_deployed_bots_user_id ON public.deployed_bots(user_id);
CREATE INDEX IF NOT EXISTS idx_deployed_bots_status ON public.deployed_bots(status);
CREATE INDEX IF NOT EXISTS idx_deployed_bots_session_id ON public.deployed_bots(session_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_user_id ON public.coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_status ON public.coin_transactions(status);

-- Enable Row Level Security
ALTER TABLE public.chatbot_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployed_bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chatbot_users
CREATE POLICY "Users can view their own profile" ON public.chatbot_users
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own profile" ON public.chatbot_users
  FOR UPDATE USING (auth.uid() = auth_id);

-- RLS Policies for chatbot_types (everyone can read)
CREATE POLICY "Bot types are readable by everyone" ON public.chatbot_types
  FOR SELECT USING (is_active = true);

-- RLS Policies for deployed_bots
CREATE POLICY "Users can view their own bots" ON public.deployed_bots
  FOR SELECT USING (user_id = (SELECT id FROM public.chatbot_users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can create bots" ON public.deployed_bots
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM public.chatbot_users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update their own bots" ON public.deployed_bots
  FOR UPDATE USING (user_id = (SELECT id FROM public.chatbot_users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete their own bots" ON public.deployed_bots
  FOR DELETE USING (user_id = (SELECT id FROM public.chatbot_users WHERE auth_id = auth.uid()));

-- RLS Policies for coin_transactions
CREATE POLICY "Users can view their own transactions" ON public.coin_transactions
  FOR SELECT USING (user_id = (SELECT id FROM public.chatbot_users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can create transactions" ON public.coin_transactions
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM public.chatbot_users WHERE auth_id = auth.uid()));

-- Insert sample bot types
INSERT INTO public.chatbot_types (name, description, long_description, category, icon, cost_in_coins, features, is_active, admin_only)
VALUES 
  (
    'WhatsApp Bot Pro',
    'Professional WhatsApp automation and messaging bot',
    'Deploy a powerful WhatsApp bot that automates customer support, marketing campaigns, and business operations. Features real-time message handling, media support, and advanced filtering.',
    'Messaging',
    '💬',
    10,
    ARRAY['Real-time Messages', 'Media Support', 'Automated Responses', 'Contact Management', 'Message Scheduling', 'Analytics'],
    true,
    false
  ),
  (
    'Customer Support Bot',
    'AI-powered customer support automation',
    'Intelligent chatbot that handles customer inquiries 24/7. Integrated with knowledge base, ticket system, and human handoff capabilities for complex issues.',
    'Support',
    '🎯',
    15,
    ARRAY['AI Responses', 'Ticket System', 'Knowledge Base', 'Human Handoff', 'Multi-language', 'Analytics'],
    true,
    false
  ),
  (
    'E-commerce Bot',
    'Shopping and order management bot',
    'Complete e-commerce solution with product catalog, shopping cart, order tracking, and payment integration for WhatsApp and other platforms.',
    'Commerce',
    '🛍️',
    20,
    ARRAY['Product Catalog', 'Shopping Cart', 'Order Tracking', 'Payment Gateway', 'Inventory Sync', 'Reports'],
    true,
    false
  ),
  (
    'Marketing Bot',
    'Campaign automation and lead generation',
    'Powerful marketing automation tool for WhatsApp campaigns, lead generation, appointment booking, and customer engagement with advanced segmentation.',
    'Marketing',
    '📢',
    12,
    ARRAY['Campaign Management', 'Lead Capture', 'Segmentation', 'Appointment Booking', 'A/B Testing', 'Performance Metrics'],
    true,
    false
  ),
  (
    'Lead Generation Bot',
    'Advanced lead capture and qualification',
    'Intelligent bot that captures leads from WhatsApp, qualifies them based on custom criteria, and integrates with CRM systems for seamless sales workflow.',
    'Sales',
    '🎁',
    18,
    ARRAY['Lead Capture', 'Qualification', 'CRM Integration', 'Follow-up Automation', 'Score Tracking', 'Export Options'],
    true,
    false
  )
ON CONFLICT (name) DO NOTHING;
```

5. **Execute the SQL** - You should see "0 rows affected" or success message

## Step 2: Verify Environment Variables

Check that these variables are set in Vercel Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

**These are automatically set if Supabase is connected.**

## Step 3: Optional - M-Pesa Payment Setup

To enable coin purchases via M-Pesa, add these to Vercel Environment Variables:

```
PAYFLOW_API_KEY=<your-key>
PAYFLOW_API_SECRET=<your-secret>
PAYFLOW_PAYMENT_ACCOUNT_ID=<your-account-id>
```

Without these, the coin purchase button will show an error.

## Step 4: Redeploy

1. Go to Vercel Dashboard
2. Click your project
3. Click "Redeploy" or push a new commit
4. Wait for deployment

## Step 5: Test the Platform

1. Visit `https://yourdomain.com/chatbots-ai`
2. Click "Get Started Now" or "Deploy Bot"
3. Sign up for a new account
4. Try the chatbots dashboard at `/chatbots-ai/dashboard`

## Troubleshooting

### "supabaseUrl is required" Error
- Verify `NEXT_PUBLIC_SUPABASE_URL` is in Vercel environment variables
- Redeploy after adding it

### "Cannot find table chatbot_users"
- You haven't run the SQL migration yet
- Go to Supabase SQL Editor and execute the full SQL script above

### "Unauthorized" on API calls
- Check that you're logged in
- Check browser console for auth token errors
- Verify RLS policies are created

### Components not showing
- Delete `/client/` folder (legacy folder)
- All components are in `/components/`
- Restart dev server or redeploy

## What's Included

- ✅ Complete authentication (signup/login)
- ✅ Bot type listing and selection
- ✅ Bot deployment with session IDs
- ✅ Coin balance tracking
- ✅ M-Pesa payment integration
- ✅ Full dashboard with bot management
- ✅ RLS security policies
- ✅ Mobile responsive design

## Platform Routes

- `/chatbots-ai` - Landing page with bot showcase
- `/chatbots-ai/dashboard` - User dashboard (protected)
- `/api/chatbots/auth/*` - Authentication endpoints
- `/api/chatbots/bots/*` - Bot management endpoints
- `/api/chatbots/coins/*` - Coin purchase endpoints

Enjoy your chatbots SaaS platform!
