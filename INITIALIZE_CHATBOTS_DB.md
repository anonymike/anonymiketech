# Initialize Chatbots Database - CRITICAL SETUP STEP

## Current Issue
Your Vercel deployment is failing with "Failed to create user profile" because the chatbots database tables don't exist yet in Supabase.

## Solution: Run the Database Migration

Follow these steps **exactly**:

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **+ New Query**

### Step 2: Copy the Migration SQL
Copy all the SQL code from the section below and paste it into the SQL editor.

### Step 3: Execute the SQL
Click the **Run** button (or press Ctrl+Enter) to execute all queries.

### Step 4: Verify Success
You should see success messages for each table creation. If you see errors about tables already existing, that's fine - it just means the migration ran before.

---

## Migration SQL - Copy Everything Below and Paste into Supabase SQL Editor

```sql
-- ============================================
-- CHATBOTS PLATFORM DATABASE SCHEMA
-- ============================================

-- 1. CREATE CHATBOT_USERS TABLE
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

-- 2. CREATE CHATBOT_TYPES TABLE
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

-- 3. CREATE DEPLOYED_BOTS TABLE
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

-- 4. CREATE COIN_TRANSACTIONS TABLE
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

-- 5. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_chatbot_users_auth_id ON public.chatbot_users(auth_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_users_username ON public.chatbot_users(username);
CREATE INDEX IF NOT EXISTS idx_deployed_bots_user_id ON public.deployed_bots(user_id);
CREATE INDEX IF NOT EXISTS idx_deployed_bots_status ON public.deployed_bots(status);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_user_id ON public.coin_transactions(user_id);

-- 6. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.chatbot_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployed_bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

-- 7. CREATE RLS POLICIES FOR CHATBOT_USERS
CREATE POLICY "Users can view own profile" ON public.chatbot_users
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own profile" ON public.chatbot_users
  FOR UPDATE USING (auth.uid() = auth_id);

-- 8. CREATE RLS POLICIES FOR CHATBOT_TYPES
CREATE POLICY "Anyone can view active bot types" ON public.chatbot_types
  FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

-- 9. CREATE RLS POLICIES FOR DEPLOYED_BOTS
CREATE POLICY "Users can view own bots" ON public.deployed_bots
  FOR SELECT USING (auth.uid() IN (SELECT auth_id FROM public.chatbot_users WHERE id = user_id));

CREATE POLICY "Users can update own bots" ON public.deployed_bots
  FOR UPDATE USING (auth.uid() IN (SELECT auth_id FROM public.chatbot_users WHERE id = user_id));

CREATE POLICY "Users can delete own bots" ON public.deployed_bots
  FOR DELETE USING (auth.uid() IN (SELECT auth_id FROM public.chatbot_users WHERE id = user_id));

-- 10. CREATE RLS POLICIES FOR COIN_TRANSACTIONS
CREATE POLICY "Users can view own transactions" ON public.coin_transactions
  FOR SELECT USING (auth.uid() IN (SELECT auth_id FROM public.chatbot_users WHERE id = user_id));

-- 11. INSERT SAMPLE BOT TYPES
INSERT INTO public.chatbot_types (name, description, long_description, category, icon, cost_in_coins, features, is_active)
VALUES 
  ('WhatsApp Bot Pro', 'Professional WhatsApp automation and messaging bot', 'Deploy a powerful WhatsApp bot that automates customer support, marketing campaigns, and business operations.', 'Messaging', '💬', 10, ARRAY['Real-time Messages', 'Media Support', 'Automated Responses', 'Contact Management'], true),
  ('Customer Support Bot', 'AI-powered customer support automation', 'Intelligent chatbot that handles customer inquiries 24/7 with knowledge base and ticket system.', 'Support', '🎯', 15, ARRAY['AI Responses', 'Ticket System', 'Knowledge Base', 'Human Handoff'], true),
  ('E-commerce Bot', 'Shopping and order management bot', 'Complete e-commerce solution with product catalog, shopping cart, and order tracking.', 'Commerce', '🛍️', 20, ARRAY['Product Catalog', 'Shopping Cart', 'Order Tracking', 'Payment Gateway'], true),
  ('Marketing Bot', 'Campaign automation and lead generation', 'Powerful marketing automation tool for campaigns, lead generation, and customer engagement.', 'Marketing', '📢', 12, ARRAY['Campaign Management', 'Lead Capture', 'Segmentation', 'A/B Testing'], true),
  ('Lead Generation Bot', 'Advanced lead capture and qualification', 'Intelligent bot that captures leads and integrates with CRM systems for seamless sales workflow.', 'Sales', '🎁', 18, ARRAY['Lead Capture', 'Qualification', 'CRM Integration', 'Follow-up Automation'], true)
ON CONFLICT (name) DO NOTHING;

-- SUCCESS MESSAGE
SELECT 'Database initialization complete! All tables created and policies configured.' as status;
```

---

## After Running the SQL

1. **Verify the tables exist**: In Supabase, go to **Table Editor** and you should see:
   - `chatbot_users`
   - `chatbot_types`
   - `deployed_bots`
   - `coin_transactions`

2. **Redeploy on Vercel**: 
   - Go to your Vercel project
   - Click **Deployments**
   - Click the **three dots** on the latest deployment
   - Select **Redeploy**

3. **Test the signup**: Try creating an account again at `/chatbots-ai`

---

## Troubleshooting

### Error: "relation 'chatbot_users' does not exist"
This means the SQL didn't execute properly. Make sure you:
1. Copied the ENTIRE SQL block above
2. Pasted it all into one SQL Editor query
3. Clicked the Run button
4. Waited for execution to complete

### Error: "duplicate key violates unique constraint"
This is fine - it means the tables already exist and you're trying to insert duplicate data. Just skip the INSERT statements and proceed.

### Still getting "Failed to create user profile"
Check the Vercel deployment logs:
1. Go to Vercel → Deployments → Latest → Logs
2. Look for `[v0]` messages which will show the exact error
3. The error message now includes "Database tables not initialized" if this is the issue

---

## Success!
Once the tables are created and your app is redeployed, you should be able to:
✅ Create a new account at `/chatbots-ai`
✅ See your user profile in the dashboard
✅ Purchase coins
✅ Deploy chatbots
