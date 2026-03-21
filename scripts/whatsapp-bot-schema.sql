-- ======================================
-- WhatsApp Bot Deployment System Schema
-- ======================================

-- WhatsApp Bot Types/Templates table
CREATE TABLE IF NOT EXISTS whatsapp_bot_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  category TEXT NOT NULL,
  icon TEXT,
  image TEXT,
  github_repo_url TEXT,
  documentation_url TEXT,
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  supported_deployment_types TEXT[] DEFAULT ARRAY['heroku', 'railway', 'render', 'docker', 'vps']::TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WhatsApp Credentials & Sessions table
CREATE TABLE IF NOT EXISTS whatsapp_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES chatbot_users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  session_id TEXT UNIQUE NOT NULL,
  qr_code_status TEXT DEFAULT 'pending', -- pending, generated, scanned, authenticated, expired
  is_authenticated BOOLEAN DEFAULT false,
  baileys_session_data JSONB, -- Stores Baileys library session data
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  authenticated_at TIMESTAMP,
  expires_at TIMESTAMP,
  UNIQUE(user_id, phone_number)
);

-- Deployed WhatsApp Bots table
CREATE TABLE IF NOT EXISTS whatsapp_bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES chatbot_users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES whatsapp_bot_templates(id),
  credentials_id UUID NOT NULL REFERENCES whatsapp_credentials(id) ON DELETE CASCADE,
  bot_name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'inactive', -- inactive, active, paused, error, deployment_pending
  deployment_status TEXT DEFAULT 'not_deployed', -- not_deployed, in_progress, deployed, failed
  deployment_error_message TEXT,
  
  -- Branding & Customization
  bot_logo_url TEXT,
  welcome_message TEXT,
  default_response TEXT,
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  
  -- Operational Settings
  is_enabled BOOLEAN DEFAULT true,
  allow_unknown_users BOOLEAN DEFAULT false,
  auto_reply_enabled BOOLEAN DEFAULT true,
  
  -- Rate Limiting & Quotas
  rate_limit_messages_per_minute INTEGER DEFAULT 30,
  rate_limit_users_per_day INTEGER DEFAULT 100,
  max_concurrent_sessions INTEGER DEFAULT 50,
  
  -- Working Hours
  working_hours_enabled BOOLEAN DEFAULT false,
  working_hours_start_time TIME,
  working_hours_end_time TIME,
  working_hours_timezone TEXT,
  
  -- Session Management
  session_timeout_minutes INTEGER DEFAULT 30,
  save_session_data BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP,
  deployed_at TIMESTAMP
);

-- Bot Configuration & Webhooks table
CREATE TABLE IF NOT EXISTS whatsapp_bot_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES whatsapp_bots(id) ON DELETE CASCADE UNIQUE,
  
  -- Webhook URLs
  message_webhook_url TEXT,
  status_webhook_url TEXT,
  error_webhook_url TEXT,
  
  -- API Keys & Secrets
  api_key TEXT UNIQUE,
  webhook_secret_key TEXT,
  
  -- AI & Prompt Configuration
  ai_provider TEXT DEFAULT 'openai', -- openai, anthropic, groq, cohere
  ai_model_name TEXT,
  system_prompt TEXT,
  max_tokens INTEGER DEFAULT 150,
  temperature NUMERIC DEFAULT 0.7,
  
  -- Command Definitions
  custom_commands JSONB DEFAULT '{}'::JSONB, -- {"/help": "Shows help info", "/menu": "Shows main menu"}
  
  -- Response Templates
  response_templates JSONB DEFAULT '{}'::JSONB,
  
  -- Environment Variables (encrypted)
  env_variables JSONB, -- {API_KEY: "...", OPENAI_KEY: "..."}
  
  -- Access Control
  allowed_phone_numbers TEXT[] DEFAULT ARRAY[]::TEXT[],
  blocked_phone_numbers TEXT[] DEFAULT ARRAY[]::TEXT[],
  allowed_groups TEXT[] DEFAULT ARRAY[]::TEXT[],
  blocked_groups TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Advanced Settings
  enable_read_receipts BOOLEAN DEFAULT true,
  enable_typing_indicator BOOLEAN DEFAULT true,
  enable_context_memory BOOLEAN DEFAULT true,
  context_memory_messages INTEGER DEFAULT 10,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deployment Configuration table (Heroku, Railway, Render, Docker, etc)
CREATE TABLE IF NOT EXISTS whatsapp_deployment_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES whatsapp_bots(id) ON DELETE CASCADE UNIQUE,
  
  deployment_type TEXT NOT NULL, -- heroku, railway, render, docker, vps, aws
  deployment_provider_account_id TEXT,
  deployment_app_name TEXT,
  deployment_app_url TEXT,
  
  -- Deployment Credentials (encrypted)
  provider_api_key TEXT,
  provider_secret TEXT,
  
  -- Build & Deploy Settings
  repository_url TEXT,
  branch_name TEXT DEFAULT 'main',
  auto_deploy_enabled BOOLEAN DEFAULT false,
  auto_deploy_trigger TEXT DEFAULT 'git_push', -- git_push, webhook, manual
  
  -- Environment Variables for Deployment
  deployment_env_vars JSONB DEFAULT '{}'::JSONB,
  
  -- Webhook for deployment events
  deployment_webhook_url TEXT,
  
  -- Heroku specific
  heroku_app_id TEXT,
  heroku_dyno_type TEXT DEFAULT 'eco',
  
  -- Railway specific
  railway_service_id TEXT,
  railway_environment_id TEXT,
  
  -- Render specific
  render_service_id TEXT,
  render_deploy_hook_url TEXT,
  
  -- VPS/Server specific
  server_host TEXT,
  server_port INTEGER DEFAULT 3000,
  server_user TEXT,
  ssh_key_id TEXT,
  
  -- Docker specific
  docker_image_url TEXT,
  docker_registry_user TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deployed_at TIMESTAMP
);

-- Bot Activity & Logs table
CREATE TABLE IF NOT EXISTS whatsapp_bot_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES whatsapp_bots(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- message_received, message_sent, error, status_change, deployment, user_action
  message_from TEXT,
  message_to TEXT,
  message_content TEXT,
  message_id TEXT,
  response_content TEXT,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_bot_created (bot_id, created_at DESC),
  INDEX idx_event_type (event_type, created_at DESC)
);

-- Bot Session Management table
CREATE TABLE IF NOT EXISTS whatsapp_bot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES whatsapp_bots(id) ON DELETE CASCADE,
  user_phone_number TEXT NOT NULL,
  session_data JSONB DEFAULT '{}'::JSONB, -- Stores conversation context, user preferences
  last_message_at TIMESTAMP,
  session_expired BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  
  UNIQUE(bot_id, user_phone_number)
);

-- Bot Analytics & Metrics table
CREATE TABLE IF NOT EXISTS whatsapp_bot_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES whatsapp_bots(id) ON DELETE CASCADE,
  
  total_messages_received INTEGER DEFAULT 0,
  total_messages_sent INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  total_conversations INTEGER DEFAULT 0,
  average_response_time_ms NUMERIC DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  uptime_percentage NUMERIC DEFAULT 100,
  
  last_24h_messages INTEGER DEFAULT 0,
  last_7d_messages INTEGER DEFAULT 0,
  last_30d_messages INTEGER DEFAULT 0,
  
  analytics_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(bot_id, analytics_date)
);

-- Deployment History table
CREATE TABLE IF NOT EXISTS whatsapp_deployment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES whatsapp_bots(id) ON DELETE CASCADE,
  deployment_type TEXT NOT NULL,
  status TEXT NOT NULL, -- in_progress, success, failed, rolled_back
  version TEXT,
  deployed_by_user_id UUID REFERENCES chatbot_users(id),
  
  deployment_log TEXT,
  error_details TEXT,
  deployment_duration_seconds INTEGER,
  
  previous_status TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Access Control & Permissions table
CREATE TABLE IF NOT EXISTS whatsapp_bot_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES whatsapp_bots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES chatbot_users(id) ON DELETE CASCADE,
  
  role TEXT NOT NULL DEFAULT 'viewer', -- owner, admin, editor, viewer
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(bot_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_templates_category ON whatsapp_bot_templates(category);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_templates_active ON whatsapp_bot_templates(is_active);

CREATE INDEX IF NOT EXISTS idx_whatsapp_credentials_user_id ON whatsapp_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_credentials_phone ON whatsapp_credentials(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_credentials_authenticated ON whatsapp_credentials(is_authenticated);

CREATE INDEX IF NOT EXISTS idx_whatsapp_bots_user_id ON whatsapp_bots(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bots_status ON whatsapp_bots(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bots_deployment_status ON whatsapp_bots(deployment_status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bots_created_at ON whatsapp_bots(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_config_bot_id ON whatsapp_bot_config(bot_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_config_api_key ON whatsapp_bot_config(api_key);

CREATE INDEX IF NOT EXISTS idx_whatsapp_deployment_config_bot_id ON whatsapp_deployment_config(bot_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_deployment_config_type ON whatsapp_deployment_config(deployment_type);

CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_logs_bot_id ON whatsapp_bot_logs(bot_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_logs_created ON whatsapp_bot_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_logs_event_type ON whatsapp_bot_logs(event_type);

CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_sessions_bot_id ON whatsapp_bot_sessions(bot_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_sessions_expires ON whatsapp_bot_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_analytics_bot_id ON whatsapp_bot_analytics(bot_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_analytics_date ON whatsapp_bot_analytics(analytics_date DESC);

CREATE INDEX IF NOT EXISTS idx_whatsapp_deployment_history_bot_id ON whatsapp_deployment_history(bot_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_deployment_history_created ON whatsapp_deployment_history(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_members_bot_id ON whatsapp_bot_members(bot_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_members_user_id ON whatsapp_bot_members(user_id);

-- Add RLS policies (if using Supabase)
ALTER TABLE whatsapp_bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_bot_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_deployment_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_bot_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_bot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_bot_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_deployment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_bot_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for whatsapp_bots
CREATE POLICY "Users can view their own bots" ON whatsapp_bots
  FOR SELECT USING (user_id = auth.uid()::text OR EXISTS (
    SELECT 1 FROM whatsapp_bot_members 
    WHERE whatsapp_bot_members.bot_id = whatsapp_bots.id 
    AND whatsapp_bot_members.user_id = auth.uid()::text
  ));

CREATE POLICY "Users can create their own bots" ON whatsapp_bots
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own bots" ON whatsapp_bots
  FOR UPDATE USING (user_id = auth.uid()::text);

CREATE POLICY "Users can delete their own bots" ON whatsapp_bots
  FOR DELETE USING (user_id = auth.uid()::text);

-- RLS Policies for whatsapp_credentials
CREATE POLICY "Users can view their own credentials" ON whatsapp_credentials
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create their own credentials" ON whatsapp_credentials
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own credentials" ON whatsapp_credentials
  FOR UPDATE USING (user_id = auth.uid()::text);

-- RLS Policies for whatsapp_bot_config
CREATE POLICY "Users can manage their bot config" ON whatsapp_bot_config
  FOR ALL USING (EXISTS (
    SELECT 1 FROM whatsapp_bots 
    WHERE whatsapp_bots.id = whatsapp_bot_config.bot_id 
    AND whatsapp_bots.user_id = auth.uid()::text
  ));

-- RLS Policies for whatsapp_deployment_config
CREATE POLICY "Users can manage their deployment config" ON whatsapp_deployment_config
  FOR ALL USING (EXISTS (
    SELECT 1 FROM whatsapp_bots 
    WHERE whatsapp_bots.id = whatsapp_deployment_config.bot_id 
    AND whatsapp_bots.user_id = auth.uid()::text
  ));

-- RLS Policies for whatsapp_bot_logs
CREATE POLICY "Users can view their bot logs" ON whatsapp_bot_logs
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM whatsapp_bots 
    WHERE whatsapp_bots.id = whatsapp_bot_logs.bot_id 
    AND whatsapp_bots.user_id = auth.uid()::text
  ));

-- RLS Policies for whatsapp_bot_sessions
CREATE POLICY "Users can view their bot sessions" ON whatsapp_bot_sessions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM whatsapp_bots 
    WHERE whatsapp_bots.id = whatsapp_bot_sessions.bot_id 
    AND whatsapp_bots.user_id = auth.uid()::text
  ));

-- RLS Policies for whatsapp_bot_analytics
CREATE POLICY "Users can view their bot analytics" ON whatsapp_bot_analytics
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM whatsapp_bots 
    WHERE whatsapp_bots.id = whatsapp_bot_analytics.bot_id 
    AND whatsapp_bots.user_id = auth.uid()::text
  ));

-- RLS Policies for whatsapp_deployment_history
CREATE POLICY "Users can view their deployment history" ON whatsapp_deployment_history
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM whatsapp_bots 
    WHERE whatsapp_bots.id = whatsapp_deployment_history.bot_id 
    AND whatsapp_bots.user_id = auth.uid()::text
  ));

-- RLS Policies for whatsapp_bot_members
CREATE POLICY "Users can view bot members" ON whatsapp_bot_members
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM whatsapp_bots 
    WHERE whatsapp_bots.id = whatsapp_bot_members.bot_id 
    AND whatsapp_bots.user_id = auth.uid()::text
  ));

CREATE POLICY "Bot owners can manage members" ON whatsapp_bot_members
  FOR ALL USING (EXISTS (
    SELECT 1 FROM whatsapp_bots 
    WHERE whatsapp_bots.id = whatsapp_bot_members.bot_id 
    AND whatsapp_bots.user_id = auth.uid()::text
  ));
