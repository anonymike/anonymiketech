# WhatsApp Bot Database Migration Guide

This document provides instructions to set up the WhatsApp bot tables in your Supabase database.

## Quick Setup

Copy and paste the SQL below into your **Supabase SQL Editor** (accessible from your project dashboard):

```sql
-- ============================================
-- WhatsApp Bot Tables Migration
-- ============================================

-- Table: whatsapp_bots
-- Stores WhatsApp bot instances and their basic configuration
CREATE TABLE IF NOT EXISTS public.whatsapp_bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bot_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  template_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'inactive',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_bots_user_id ON public.whatsapp_bots(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bots_status ON public.whatsapp_bots(status);

-- Enable Row Level Security (RLS) for whatsapp_bots
ALTER TABLE public.whatsapp_bots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bots"
  ON public.whatsapp_bots
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bots"
  ON public.whatsapp_bots
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bots"
  ON public.whatsapp_bots
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bots"
  ON public.whatsapp_bots
  FOR DELETE
  USING (auth.uid() = user_id);

-- Table: whatsapp_bot_config
-- Stores detailed bot configuration including AI prompts and commands
CREATE TABLE IF NOT EXISTS public.whatsapp_bot_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES public.whatsapp_bots(id) ON DELETE CASCADE,
  system_prompt TEXT,
  welcome_message TEXT,
  goodbye_message TEXT,
  commands JSONB,
  business_hours JSONB,
  whitelist_numbers TEXT[],
  rate_limit_per_hour INTEGER DEFAULT 100,
  rate_limit_per_day INTEGER DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_config_bot_id ON public.whatsapp_bot_config(bot_id);

-- Enable RLS for whatsapp_bot_config
ALTER TABLE public.whatsapp_bot_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their bots' config"
  ON public.whatsapp_bot_config
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.whatsapp_bots 
    WHERE id = whatsapp_bot_config.bot_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update their bots' config"
  ON public.whatsapp_bot_config
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.whatsapp_bots 
    WHERE id = whatsapp_bot_config.bot_id 
    AND user_id = auth.uid()
  ));

-- Table: whatsapp_deployment_config
-- Stores deployment information for different platforms
CREATE TABLE IF NOT EXISTS public.whatsapp_deployment_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES public.whatsapp_bots(id) ON DELETE CASCADE,
  platform VARCHAR(50),
  deployment_url VARCHAR(500),
  environment_variables JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_deployment_config_bot_id ON public.whatsapp_deployment_config(bot_id);

-- Enable RLS for whatsapp_deployment_config
ALTER TABLE public.whatsapp_deployment_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their deployment config"
  ON public.whatsapp_deployment_config
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.whatsapp_bots 
    WHERE id = whatsapp_deployment_config.bot_id 
    AND user_id = auth.uid()
  ));

-- Table: whatsapp_bot_sessions
-- Stores session data including QR codes and authentication status
CREATE TABLE IF NOT EXISTS public.whatsapp_bot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES public.whatsapp_bots(id) ON DELETE CASCADE,
  session_key TEXT,
  qr_code TEXT,
  is_authenticated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_sessions_bot_id ON public.whatsapp_bot_sessions(bot_id);

-- Enable RLS for whatsapp_bot_sessions
ALTER TABLE public.whatsapp_bot_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their sessions"
  ON public.whatsapp_bot_sessions
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.whatsapp_bots 
    WHERE id = whatsapp_bot_sessions.bot_id 
    AND user_id = auth.uid()
  ));

-- Table: whatsapp_bot_logs
-- Stores activity logs for audit and debugging
CREATE TABLE IF NOT EXISTS public.whatsapp_bot_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES public.whatsapp_bots(id) ON DELETE CASCADE,
  action VARCHAR(255),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_logs_bot_id ON public.whatsapp_bot_logs(bot_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_logs_created_at ON public.whatsapp_bot_logs(created_at);

-- Enable RLS for whatsapp_bot_logs
ALTER TABLE public.whatsapp_bot_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their logs"
  ON public.whatsapp_bot_logs
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.whatsapp_bots 
    WHERE id = whatsapp_bot_logs.bot_id 
    AND user_id = auth.uid()
  ));

-- Table: whatsapp_bot_analytics
-- Stores analytics and usage metrics
CREATE TABLE IF NOT EXISTS public.whatsapp_bot_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES public.whatsapp_bots(id) ON DELETE CASCADE,
  messages_sent INTEGER DEFAULT 0,
  messages_received INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_analytics_bot_id ON public.whatsapp_bot_analytics(bot_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_analytics_date ON public.whatsapp_bot_analytics(date);

-- Enable RLS for whatsapp_bot_analytics
ALTER TABLE public.whatsapp_bot_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their analytics"
  ON public.whatsapp_bot_analytics
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.whatsapp_bots 
    WHERE id = whatsapp_bot_analytics.bot_id 
    AND user_id = auth.uid()
  ));
```

## Instructions

1. **Log into your Supabase project** at https://supabase.com
2. **Navigate to the SQL Editor** from the left sidebar
3. **Click "New query"** or "New SQL snippet"
4. **Copy and paste the entire SQL code** above into the editor
5. **Click "Run"** to execute the migration
6. **Verify the tables were created** by checking the "Tables" section in the left sidebar

## Verification

After running the migration, you should see these 6 tables in your Supabase project:
- `whatsapp_bots` - Main bot records
- `whatsapp_bot_config` - Bot configuration
- `whatsapp_deployment_config` - Deployment settings
- `whatsapp_bot_sessions` - Session management
- `whatsapp_bot_logs` - Activity logs
- `whatsapp_bot_analytics` - Usage metrics

## Troubleshooting

**Error: "Table already exists"**
- This is normal if you've run the migration before. The SQL includes `IF NOT EXISTS` clauses, so it won't recreate tables.

**Error: "Could not find the table 'public.whatsapp_bots'"**
- The migration hasn't been run yet. Follow the instructions above to run the SQL.

**Error: "Permission denied"**
- Ensure you're using the correct Supabase role with sufficient permissions (service_role is recommended).

## Next Steps

Once the tables are created:
1. Refresh your application
2. The "Failed to fetch bots" error should be gone
3. You should now see the "Create Bot" option
4. Start creating and deploying WhatsApp bots!
