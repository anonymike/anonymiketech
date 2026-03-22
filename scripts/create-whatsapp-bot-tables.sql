-- WhatsApp Bot Tables Migration
-- This script creates all necessary tables for the WhatsApp bot deployment system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- WhatsApp Bot Templates Table
CREATE TABLE IF NOT EXISTS public.whatsapp_bots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bot_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  template_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'draft',
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, phone_number)
);

-- WhatsApp Bot Configuration Table
CREATE TABLE IF NOT EXISTS public.whatsapp_bot_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bot_id UUID NOT NULL REFERENCES public.whatsapp_bots(id) ON DELETE CASCADE,
  ai_prompt TEXT,
  system_message TEXT,
  welcome_message TEXT,
  goodbye_message TEXT,
  company_name VARCHAR(255),
  brand_color VARCHAR(7),
  commands JSONB,
  rate_limit_hourly INTEGER DEFAULT 100,
  rate_limit_daily INTEGER DEFAULT 1000,
  business_hours JSONB,
  whitelisted_numbers TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(bot_id)
);

-- WhatsApp Deployment Configuration Table
CREATE TABLE IF NOT EXISTS public.whatsapp_deployment_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bot_id UUID NOT NULL REFERENCES public.whatsapp_bots(id) ON DELETE CASCADE,
  deployment_type VARCHAR(50) NOT NULL,
  deployment_url VARCHAR(1000),
  webhook_url VARCHAR(1000),
  environment_variables JSONB,
  deployment_status VARCHAR(50) DEFAULT 'pending',
  deployment_logs TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- WhatsApp Bot Sessions Table
CREATE TABLE IF NOT EXISTS public.whatsapp_bot_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bot_id UUID NOT NULL REFERENCES public.whatsapp_bots(id) ON DELETE CASCADE,
  session_id VARCHAR(255) UNIQUE,
  qr_code TEXT,
  phone_connected BOOLEAN DEFAULT FALSE,
  session_data JSONB,
  last_activity TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- WhatsApp Bot Activity Logs Table
CREATE TABLE IF NOT EXISTS public.whatsapp_bot_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bot_id UUID NOT NULL REFERENCES public.whatsapp_bots(id) ON DELETE CASCADE,
  message_type VARCHAR(50),
  sender VARCHAR(255),
  message_content TEXT,
  response TEXT,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- WhatsApp Bot Analytics Table
CREATE TABLE IF NOT EXISTS public.whatsapp_bot_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bot_id UUID NOT NULL REFERENCES public.whatsapp_bots(id) ON DELETE CASCADE,
  total_messages INTEGER DEFAULT 0,
  total_users INTEGER DEFAULT 0,
  average_response_time FLOAT DEFAULT 0,
  success_rate FLOAT DEFAULT 0,
  error_rate FLOAT DEFAULT 0,
  last_24h_messages INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_bots_user_id ON public.whatsapp_bots(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bots_status ON public.whatsapp_bots(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_config_bot_id ON public.whatsapp_bot_config(bot_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_deployment_config_bot_id ON public.whatsapp_deployment_config(bot_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_sessions_bot_id ON public.whatsapp_bot_sessions(bot_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_logs_bot_id ON public.whatsapp_bot_logs(bot_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_logs_created_at ON public.whatsapp_bot_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_analytics_bot_id ON public.whatsapp_bot_analytics(bot_id);

-- Enable Row Level Security
ALTER TABLE public.whatsapp_bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_bot_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_deployment_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_bot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_bot_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_bot_analytics ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies for whatsapp_bots
CREATE POLICY "Users can only view their own bots" 
  ON public.whatsapp_bots FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only create their own bots" 
  ON public.whatsapp_bots FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own bots" 
  ON public.whatsapp_bots FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own bots" 
  ON public.whatsapp_bots FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for related tables (allow access through bot_id foreign key)
CREATE POLICY "Users can access bot config for their bots" 
  ON public.whatsapp_bot_config FOR SELECT 
  USING (EXISTS(SELECT 1 FROM public.whatsapp_bots WHERE id = bot_id AND user_id = auth.uid()));

CREATE POLICY "Users can modify config for their bots" 
  ON public.whatsapp_bot_config FOR INSERT 
  WITH CHECK (EXISTS(SELECT 1 FROM public.whatsapp_bots WHERE id = bot_id AND user_id = auth.uid()));

CREATE POLICY "Users can update config for their bots" 
  ON public.whatsapp_bot_config FOR UPDATE 
  USING (EXISTS(SELECT 1 FROM public.whatsapp_bots WHERE id = bot_id AND user_id = auth.uid()));

-- Similar policies for other tables
CREATE POLICY "Users can access deployment config for their bots" 
  ON public.whatsapp_deployment_config FOR SELECT 
  USING (EXISTS(SELECT 1 FROM public.whatsapp_bots WHERE id = bot_id AND user_id = auth.uid()));

CREATE POLICY "Users can access sessions for their bots" 
  ON public.whatsapp_bot_sessions FOR SELECT 
  USING (EXISTS(SELECT 1 FROM public.whatsapp_bots WHERE id = bot_id AND user_id = auth.uid()));

CREATE POLICY "Users can access logs for their bots" 
  ON public.whatsapp_bot_logs FOR SELECT 
  USING (EXISTS(SELECT 1 FROM public.whatsapp_bots WHERE id = bot_id AND user_id = auth.uid()));

CREATE POLICY "Users can access analytics for their bots" 
  ON public.whatsapp_bot_analytics FOR SELECT 
  USING (EXISTS(SELECT 1 FROM public.whatsapp_bots WHERE id = bot_id AND user_id = auth.uid()));
