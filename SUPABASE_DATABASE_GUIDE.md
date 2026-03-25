# Supabase Database Setup Guide for TRUTH-MD Bot Platform

This guide shows you exactly which tables to create in your Supabase database to run the TRUTH-MD WhatsApp bot marketplace platform.

## Quick Summary: 9 Tables Required

1. `whatsapp_bot_templates` - Bot marketplace templates
2. `whatsapp_credentials` - WhatsApp session credentials
3. `whatsapp_bots` - Deployed bot instances
4. `whatsapp_bot_config` - Bot configuration & AI settings
5. `whatsapp_deployment_config` - Deployment configuration (Heroku, Railway, etc)
6. `whatsapp_bot_logs` - Activity logs & events
7. `whatsapp_bot_sessions` - User conversation sessions
8. `whatsapp_bot_analytics` - Bot metrics & analytics
9. `whatsapp_deployment_history` - Deployment history & audit trail
10. `whatsapp_bot_members` - Team access control

(Plus 1 dependency: `chatbot_users` table - must already exist)

---

## Prerequisites

- Supabase project created
- Authenticated admin access to create tables
- This assumes you have a `chatbot_users` table already (referenced as foreign key)

---

## Table Definitions

### 1. Bot Templates (Marketplace)

```sql
CREATE TABLE whatsapp_bot_templates (
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

CREATE INDEX idx_whatsapp_bot_templates_category ON whatsapp_bot_templates(category);
CREATE INDEX idx_whatsapp_bot_templates_active ON whatsapp_bot_templates(is_active);
```

**Purpose**: Defines available bot templates that users can deploy from the marketplace.

**Key Fields**:
- `name` - Template name (e.g., "TRUTH-MD")
- `category` - Category for filtering (e.g., "AI", "Customer Service")
- `supported_deployment_types` - Where this bot can be deployed

---

### 2. WhatsApp Credentials (QR Authentication)

```sql
CREATE TABLE whatsapp_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES chatbot_users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  session_id TEXT UNIQUE NOT NULL,
  qr_code_status TEXT DEFAULT 'pending',
  is_authenticated BOOLEAN DEFAULT false,
  baileys_session_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  authenticated_at TIMESTAMP,
  expires_at TIMESTAMP,
  UNIQUE(user_id, phone_number)
);

CREATE INDEX idx_whatsapp_credentials_user_id ON whatsapp_credentials(user_id);
CREATE INDEX idx_whatsapp_credentials_phone ON whatsapp_credentials(phone_number);
CREATE INDEX idx_whatsapp_credentials_authenticated ON whatsapp_credentials(is_authenticated);
```

**Purpose**: Stores WhatsApp session data after QR code authentication.

**Key Fields**:
- `qr_code_status` - "pending" → "generated" → "scanned" → "authenticated"
- `baileys_session_data` - JSON storing Baileys library session credentials
- `expires_at` - Session expiration for security

---

### 3. Deployed Bot Instances

```sql
CREATE TABLE whatsapp_bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES chatbot_users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES whatsapp_bot_templates(id),
  credentials_id UUID NOT NULL REFERENCES whatsapp_credentials(id) ON DELETE CASCADE,
  
  bot_name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'inactive',
  deployment_status TEXT DEFAULT 'not_deployed',
  deployment_error_message TEXT,
  
  bot_logo_url TEXT,
  welcome_message TEXT,
  default_response TEXT,
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  
  is_enabled BOOLEAN DEFAULT true,
  allow_unknown_users BOOLEAN DEFAULT false,
  auto_reply_enabled BOOLEAN DEFAULT true,
  
  rate_limit_messages_per_minute INTEGER DEFAULT 30,
  rate_limit_users_per_day INTEGER DEFAULT 100,
  max_concurrent_sessions INTEGER DEFAULT 50,
  
  working_hours_enabled BOOLEAN DEFAULT false,
  working_hours_start_time TIME,
  working_hours_end_time TIME,
  working_hours_timezone TEXT,
  
  session_timeout_minutes INTEGER DEFAULT 30,
  save_session_data BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP,
  deployed_at TIMESTAMP
);

CREATE INDEX idx_whatsapp_bots_user_id ON whatsapp_bots(user_id);
CREATE INDEX idx_whatsapp_bots_status ON whatsapp_bots(status);
CREATE INDEX idx_whatsapp_bots_deployment_status ON whatsapp_bots(deployment_status);
CREATE INDEX idx_whatsapp_bots_created_at ON whatsapp_bots(created_at DESC);
```

**Purpose**: Main table storing bot instances created by users.

**Status Values**:
- `inactive` - Not running
- `active` - Running and processing messages
- `paused` - Running but not accepting messages
- `error` - Error state
- `deployment_pending` - Waiting for deployment

---

### 4. Bot Configuration (AI & Settings)

```sql
CREATE TABLE whatsapp_bot_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES whatsapp_bots(id) ON DELETE CASCADE UNIQUE,
  
  message_webhook_url TEXT,
  status_webhook_url TEXT,
  error_webhook_url TEXT,
  
  api_key TEXT UNIQUE,
  webhook_secret_key TEXT,
  
  ai_provider TEXT DEFAULT 'openai',
  ai_model_name TEXT,
  system_prompt TEXT,
  max_tokens INTEGER DEFAULT 150,
  temperature NUMERIC DEFAULT 0.7,
  
  custom_commands JSONB DEFAULT '{}'::JSONB,
  response_templates JSONB DEFAULT '{}'::JSONB,
  env_variables JSONB,
  
  allowed_phone_numbers TEXT[] DEFAULT ARRAY[]::TEXT[],
  blocked_phone_numbers TEXT[] DEFAULT ARRAY[]::TEXT[],
  allowed_groups TEXT[] DEFAULT ARRAY[]::TEXT[],
  blocked_groups TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  enable_read_receipts BOOLEAN DEFAULT true,
  enable_typing_indicator BOOLEAN DEFAULT true,
  enable_context_memory BOOLEAN DEFAULT true,
  context_memory_messages INTEGER DEFAULT 10,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_whatsapp_bot_config_bot_id ON whatsapp_bot_config(bot_id);
CREATE INDEX idx_whatsapp_bot_config_api_key ON whatsapp_bot_config(api_key);
```

**Purpose**: Stores AI configuration, API keys, and custom settings for each bot.

**Key Fields**:
- `ai_provider` - "openai", "anthropic", "groq", "cohere"
- `custom_commands` - JSON: `{"/help": "Shows help", "/menu": "Shows menu"}`
- `env_variables` - Encrypted environment variables for deployment

---

### 5. Deployment Configuration

```sql
CREATE TABLE whatsapp_deployment_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES whatsapp_bots(id) ON DELETE CASCADE UNIQUE,
  
  deployment_type TEXT NOT NULL,
  deployment_provider_account_id TEXT,
  deployment_app_name TEXT,
  deployment_app_url TEXT,
  
  provider_api_key TEXT,
  provider_secret TEXT,
  
  repository_url TEXT,
  branch_name TEXT DEFAULT 'main',
  auto_deploy_enabled BOOLEAN DEFAULT false,
  auto_deploy_trigger TEXT DEFAULT 'git_push',
  
  deployment_env_vars JSONB DEFAULT '{}'::JSONB,
  deployment_webhook_url TEXT,
  
  heroku_app_id TEXT,
  heroku_dyno_type TEXT DEFAULT 'eco',
  
  railway_service_id TEXT,
  railway_environment_id TEXT,
  
  render_service_id TEXT,
  render_deploy_hook_url TEXT,
  
  server_host TEXT,
  server_port INTEGER DEFAULT 3000,
  server_user TEXT,
  ssh_key_id TEXT,
  
  docker_image_url TEXT,
  docker_registry_user TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deployed_at TIMESTAMP
);

CREATE INDEX idx_whatsapp_deployment_config_bot_id ON whatsapp_deployment_config(bot_id);
CREATE INDEX idx_whatsapp_deployment_config_type ON whatsapp_deployment_config(deployment_type);
```

**Purpose**: Configuration for deploying bots to different platforms.

**Supported Deployment Types**:
- `heroku` - Heroku hosting
- `railway` - Railway.app hosting
- `render` - Render.com hosting
- `docker` - Docker container
- `vps` - Virtual private server
- `aws` - AWS EC2

---

### 6. Bot Activity Logs

```sql
CREATE TABLE whatsapp_bot_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES whatsapp_bots(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  message_from TEXT,
  message_to TEXT,
  message_content TEXT,
  message_id TEXT,
  response_content TEXT,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_whatsapp_bot_logs_bot_id ON whatsapp_bot_logs(bot_id);
CREATE INDEX idx_whatsapp_bot_logs_created ON whatsapp_bot_logs(created_at DESC);
CREATE INDEX idx_whatsapp_bot_logs_event_type ON whatsapp_bot_logs(event_type);
```

**Purpose**: Stores all bot events and messages for monitoring and debugging.

**Event Types**:
- `message_received` - Incoming message
- `message_sent` - Outgoing message
- `error` - Error occurred
- `status_change` - Bot status changed
- `deployment` - Deployment event
- `user_action` - User action in dashboard

---

### 7. User Conversation Sessions

```sql
CREATE TABLE whatsapp_bot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES whatsapp_bots(id) ON DELETE CASCADE,
  user_phone_number TEXT NOT NULL,
  session_data JSONB DEFAULT '{}'::JSONB,
  last_message_at TIMESTAMP,
  session_expired BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  
  UNIQUE(bot_id, user_phone_number)
);

CREATE INDEX idx_whatsapp_bot_sessions_bot_id ON whatsapp_bot_sessions(bot_id);
CREATE INDEX idx_whatsapp_bot_sessions_expires ON whatsapp_bot_sessions(expires_at);
```

**Purpose**: Maintains conversation context and state for each user.

**Key Fields**:
- `session_data` - JSON storing conversation context, preferences, user state

---

### 8. Bot Analytics & Metrics

```sql
CREATE TABLE whatsapp_bot_analytics (
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

CREATE INDEX idx_whatsapp_bot_analytics_bot_id ON whatsapp_bot_analytics(bot_id);
CREATE INDEX idx_whatsapp_bot_analytics_date ON whatsapp_bot_analytics(analytics_date DESC);
```

**Purpose**: Daily metrics and analytics for bot performance.

---

### 9. Deployment History (Audit Trail)

```sql
CREATE TABLE whatsapp_deployment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES whatsapp_bots(id) ON DELETE CASCADE,
  deployment_type TEXT NOT NULL,
  status TEXT NOT NULL,
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

CREATE INDEX idx_whatsapp_deployment_history_bot_id ON whatsapp_deployment_history(bot_id);
CREATE INDEX idx_whatsapp_deployment_history_created ON whatsapp_deployment_history(created_at DESC);
```

**Purpose**: Track all deployment attempts for audit and rollback capabilities.

**Status Values**:
- `in_progress` - Deployment ongoing
- `success` - Deployment completed
- `failed` - Deployment failed
- `rolled_back` - Previous version restored

---

### 10. Bot Team Members (Access Control)

```sql
CREATE TABLE whatsapp_bot_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES whatsapp_bots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES chatbot_users(id) ON DELETE CASCADE,
  
  role TEXT NOT NULL DEFAULT 'viewer',
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(bot_id, user_id)
);

CREATE INDEX idx_whatsapp_bot_members_bot_id ON whatsapp_bot_members(bot_id);
CREATE INDEX idx_whatsapp_bot_members_user_id ON whatsapp_bot_members(user_id);
```

**Purpose**: Manage team access and permissions for each bot.

**Role Values**:
- `owner` - Full access, can delete
- `admin` - Can manage settings and team
- `editor` - Can modify bot and logs
- `viewer` - Read-only access

---

## Setting Up Row Level Security (RLS)

After creating the tables, enable RLS for security:

```sql
-- Enable RLS on all tables
ALTER TABLE whatsapp_bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_bot_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_deployment_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_bot_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_bot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_bot_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_deployment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_bot_members ENABLE ROW LEVEL SECURITY;

-- Example RLS policy for whatsapp_bots (allow users to see their own bots or shared bots)
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
```

---

## Dependency Diagram

```
chatbot_users (existing table - required)
    ↓
whatsapp_credentials ← user_id
whatsapp_bot_templates
    ↓
whatsapp_bots
    ├── references: user_id, template_id, credentials_id
    ├→ whatsapp_bot_config (1:1)
    ├→ whatsapp_deployment_config (1:1)
    ├→ whatsapp_bot_logs (1:N)
    ├→ whatsapp_bot_sessions (1:N)
    ├→ whatsapp_bot_analytics (1:N)
    ├→ whatsapp_deployment_history (1:N)
    └→ whatsapp_bot_members (1:N)
```

---

## Quick Setup Steps

1. **Go to Supabase Console** → Your Project → SQL Editor
2. **Create Tables**: Copy the SQL from each section above and run
3. **Enable RLS**: Run the RLS policy SQL
4. **Create Indexes**: Indexes are included in the CREATE TABLE statements
5. **Test Connection**: In your `.env.local` add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
6. **Verify**: Run a test query in your app

---

## Important Notes

- **chatbot_users**: This table must already exist. It's your user management table.
- **JSONB fields**: Store complex data like credentials, session context, and commands
- **Encryption**: Consider encrypting sensitive fields like `baileys_session_data` and `env_variables` in production
- **Indexes**: All recommended indexes are included for performance
- **Cascading Deletes**: Deleting a user deletes all related bots and data
- **Unique Constraints**: Prevent duplicate phone numbers per user, duplicate sessions, etc.

---

## Testing Your Setup

After creating tables, verify with:

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'whatsapp%';

-- Check table row counts (should all be 0)
SELECT 'whatsapp_bot_templates' as table_name, COUNT(*) FROM whatsapp_bot_templates
UNION ALL
SELECT 'whatsapp_bots', COUNT(*) FROM whatsapp_bots
UNION ALL
SELECT 'whatsapp_credentials', COUNT(*) FROM whatsapp_credentials;
```

Once all tables are created, your platform is ready to connect to Supabase!
