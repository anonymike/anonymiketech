-- WhatsApp Bot Database Schema
-- This script creates all necessary tables for the WhatsApp bot system

-- ============ Bot Templates Table ============
CREATE TABLE IF NOT EXISTS whatsapp_bot_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  icon TEXT,
  defaultPrompt TEXT NOT NULL,
  defaultWelcomeMessage TEXT,
  defaultGoodbyeMessage TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============ User Credentials Table ============
CREATE TABLE IF NOT EXISTS whatsapp_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId TEXT NOT NULL,
  phoneNumber TEXT NOT NULL,
  credentials JSONB NOT NULL,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_user_phone UNIQUE (userId, phoneNumber)
);

-- ============ WhatsApp Bots Table ============
CREATE TABLE IF NOT EXISTS whatsapp_bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId TEXT NOT NULL,
  templateId UUID NOT NULL REFERENCES whatsapp_bot_templates(id),
  name TEXT NOT NULL,
  phoneNumber TEXT NOT NULL,
  credentialId UUID NOT NULL REFERENCES whatsapp_credentials(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'error', 'pending')),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_user_phone_bot UNIQUE (userId, phoneNumber)
);

-- ============ Bot Configuration Table ============
CREATE TABLE IF NOT EXISTS whatsapp_bot_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  botId UUID NOT NULL UNIQUE REFERENCES whatsapp_bots(id) ON DELETE CASCADE,
  aiPrompt TEXT NOT NULL DEFAULT 'You are a helpful WhatsApp bot assistant.',
  companyName TEXT,
  primaryBrandColor TEXT DEFAULT '#000000',
  welcomeMessage TEXT DEFAULT 'Hello! How can I help you today?',
  goodbyeMessage TEXT DEFAULT 'Thank you for reaching out!',
  customCommands JSONB DEFAULT '[]'::jsonb,
  businessHoursEnabled BOOLEAN DEFAULT false,
  businessHours JSONB,
  accessControl JSONB DEFAULT '{"whitelistEnabled": false, "phoneNumbers": []}'::jsonb,
  rateLimiting JSONB DEFAULT '{"enabled": true, "messagesPerHour": 100, "messagesPerDay": 1000}'::jsonb,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============ Deployment Configuration Table ============
CREATE TABLE IF NOT EXISTS whatsapp_deployment_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  botId UUID NOT NULL UNIQUE REFERENCES whatsapp_bots(id) ON DELETE CASCADE,
  deploymentMethod TEXT NOT NULL CHECK (deploymentMethod IN ('direct-server', 'heroku', 'railway', 'render', 'docker')),
  environmentVariables JSONB DEFAULT '[]'::jsonb,
  deploymentStatus TEXT DEFAULT 'pending' CHECK (deploymentStatus IN ('pending', 'deploying', 'active', 'failed', 'paused')),
  deploymentUrl TEXT,
  lastDeployedAt TIMESTAMP WITH TIME ZONE,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============ Bot Sessions Table ============
CREATE TABLE IF NOT EXISTS whatsapp_bot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  botId UUID NOT NULL UNIQUE REFERENCES whatsapp_bots(id) ON DELETE CASCADE,
  sessionData JSONB NOT NULL DEFAULT '{}'::jsonb,
  qrCode TEXT,
  isConnected BOOLEAN DEFAULT false,
  lastActivity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============ Activity Logs Table ============
CREATE TABLE IF NOT EXISTS whatsapp_bot_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  botId UUID NOT NULL REFERENCES whatsapp_bots(id) ON DELETE CASCADE,
  eventType TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============ Analytics Table ============
CREATE TABLE IF NOT EXISTS whatsapp_bot_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  botId UUID NOT NULL REFERENCES whatsapp_bots(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  messagesSent INTEGER DEFAULT 0,
  messagesReceived INTEGER DEFAULT 0,
  activeUsers INTEGER DEFAULT 0,
  avgResponseTime FLOAT DEFAULT 0,
  errorCount INTEGER DEFAULT 0,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_bot_date UNIQUE (botId, date)
);

-- ============ Indexes for Performance ============
CREATE INDEX IF NOT EXISTS idx_whatsapp_bots_userId ON whatsapp_bots(userId);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bots_status ON whatsapp_bots(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_credentials_userId ON whatsapp_credentials(userId);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_logs_botId ON whatsapp_bot_logs(botId);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_logs_createdAt ON whatsapp_bot_logs(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_analytics_botId ON whatsapp_bot_analytics(botId);
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_analytics_date ON whatsapp_bot_analytics(date DESC);

-- ============ Row Level Security (RLS) Policies ============

-- Enable RLS
ALTER TABLE whatsapp_bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_bot_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_deployment_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_bot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_bot_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_bot_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_credentials ENABLE ROW LEVEL SECURITY;

-- Policies for whatsapp_bots
CREATE POLICY "Users can view their own bots"
  ON whatsapp_bots FOR SELECT
  USING (userId = auth.jwt()->>'sub');

CREATE POLICY "Users can create bots"
  ON whatsapp_bots FOR INSERT
  WITH CHECK (userId = auth.jwt()->>'sub');

CREATE POLICY "Users can update their own bots"
  ON whatsapp_bots FOR UPDATE
  USING (userId = auth.jwt()->>'sub');

CREATE POLICY "Users can delete their own bots"
  ON whatsapp_bots FOR DELETE
  USING (userId = auth.jwt()->>'sub');

-- Policies for whatsapp_bot_config
CREATE POLICY "Users can view config of their bots"
  ON whatsapp_bot_config FOR SELECT
  USING (
    botId IN (
      SELECT id FROM whatsapp_bots WHERE userId = auth.jwt()->>'sub'
    )
  );

CREATE POLICY "Users can update config of their bots"
  ON whatsapp_bot_config FOR UPDATE
  USING (
    botId IN (
      SELECT id FROM whatsapp_bots WHERE userId = auth.jwt()->>'sub'
    )
  );

-- Policies for whatsapp_deployment_config
CREATE POLICY "Users can view deployment config of their bots"
  ON whatsapp_deployment_config FOR SELECT
  USING (
    botId IN (
      SELECT id FROM whatsapp_bots WHERE userId = auth.jwt()->>'sub'
    )
  );

CREATE POLICY "Users can update deployment config of their bots"
  ON whatsapp_deployment_config FOR UPDATE
  USING (
    botId IN (
      SELECT id FROM whatsapp_bots WHERE userId = auth.jwt()->>'sub'
    )
  );

-- Policies for whatsapp_bot_sessions
CREATE POLICY "Users can view sessions of their bots"
  ON whatsapp_bot_sessions FOR SELECT
  USING (
    botId IN (
      SELECT id FROM whatsapp_bots WHERE userId = auth.jwt()->>'sub'
    )
  );

-- Policies for whatsapp_bot_logs
CREATE POLICY "Users can view logs of their bots"
  ON whatsapp_bot_logs FOR SELECT
  USING (
    botId IN (
      SELECT id FROM whatsapp_bots WHERE userId = auth.jwt()->>'sub'
    )
  );

-- Policies for whatsapp_bot_analytics
CREATE POLICY "Users can view analytics of their bots"
  ON whatsapp_bot_analytics FOR SELECT
  USING (
    botId IN (
      SELECT id FROM whatsapp_bots WHERE userId = auth.jwt()->>'sub'
    )
  );

-- Policies for whatsapp_credentials
CREATE POLICY "Users can view their own credentials"
  ON whatsapp_credentials FOR SELECT
  USING (userId = auth.jwt()->>'sub');

CREATE POLICY "Users can create credentials"
  ON whatsapp_credentials FOR INSERT
  WITH CHECK (userId = auth.jwt()->>'sub');

CREATE POLICY "Users can update their own credentials"
  ON whatsapp_credentials FOR UPDATE
  USING (userId = auth.jwt()->>'sub');

CREATE POLICY "Users can delete their own credentials"
  ON whatsapp_credentials FOR DELETE
  USING (userId = auth.jwt()->>'sub');

-- ============ Insert Default Templates ============

INSERT INTO whatsapp_bot_templates (name, description, category, icon, defaultPrompt, defaultWelcomeMessage, defaultGoodbyeMessage, features)
VALUES
  (
    'Customer Support Bot',
    'Automated customer support with FAQ and ticket creation',
    'support',
    '🤖',
    'You are a friendly customer support representative. Help customers with their issues and create tickets when needed.',
    'Hello! Welcome to our support team. How can I assist you today?',
    'Thank you for contacting us. We appreciate your business!',
    '["faq", "ticket_creation", "knowledge_base", "live_agent_handoff"]'::jsonb
  ),
  (
    'E-Commerce Bot',
    'Product search, orders, and payment information',
    'ecommerce',
    '🛍️',
    'You are a helpful shopping assistant. Help customers find products, track orders, and answer questions about payments.',
    'Welcome to our store! What would you like to find today?',
    'Thanks for shopping with us! Have a great day!',
    '["product_search", "order_tracking", "payment_info", "cart_management"]'::jsonb
  ),
  (
    'Lead Generation Bot',
    'Qualify leads and collect contact information',
    'sales',
    '📊',
    'You are a lead qualification specialist. Ask relevant questions and collect information for our sales team.',
    'Hi! Thanks for your interest. I''d love to learn more about what you need.',
    'Thanks for your information. A sales representative will reach out soon!',
    '["lead_qualification", "form_collection", "crm_integration", "appointment_scheduling"]'::jsonb
  ),
  (
    'Notification Bot',
    'Send scheduled messages and notifications',
    'notifications',
    '🔔',
    'You send timely notifications and updates to users. Keep messages brief and actionable.',
    'Hello! You''re subscribed to our updates.',
    'Thank you for using our notification service.',
    '["scheduled_messages", "event_notifications", "reminders", "broadcasts"]'::jsonb
  ),
  (
    'Custom Bot',
    'Build your own bot with custom logic',
    'custom',
    '⚙️',
    'You are a custom WhatsApp bot. Configure your prompt and behavior in the settings.',
    'Hello! How can I help you?',
    'Thank you for your message!',
    '["custom_logic", "api_integration", "database_queries", "third_party_services"]'::jsonb
  );

-- ============ Grant Permissions ============

-- Grant permissions to authenticated users
GRANT SELECT ON whatsapp_bot_templates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON whatsapp_bots TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON whatsapp_bot_config TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON whatsapp_deployment_config TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON whatsapp_bot_sessions TO authenticated;
GRANT SELECT, INSERT ON whatsapp_bot_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON whatsapp_bot_analytics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON whatsapp_credentials TO authenticated;
