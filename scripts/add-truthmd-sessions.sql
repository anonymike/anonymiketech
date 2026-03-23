-- Migration: Add TRUTH MD Session Support
-- Description: Creates table for storing TRUTH MD WhatsApp sessions
-- Created: 2026-03-23

-- Create whatsapp_bot_sessions table
CREATE TABLE IF NOT EXISTS whatsapp_bot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL,
  user_id UUID NOT NULL,
  session_string TEXT NOT NULL,
  source VARCHAR(50) DEFAULT 'truth_md',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(bot_id),
  FOREIGN KEY (bot_id) REFERENCES whatsapp_bots(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_sessions_bot_id 
  ON whatsapp_bot_sessions(bot_id);

CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_sessions_user_id 
  ON whatsapp_bot_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_sessions_source 
  ON whatsapp_bot_sessions(source);

-- Add session_source column to whatsapp_bots if it doesn't exist
ALTER TABLE whatsapp_bots 
  ADD COLUMN IF NOT EXISTS session_source VARCHAR(50) DEFAULT 'native';

-- Add has_session column to whatsapp_bots if it doesn't exist
ALTER TABLE whatsapp_bots 
  ADD COLUMN IF NOT EXISTS has_session BOOLEAN DEFAULT false;

-- Enable Row Level Security
ALTER TABLE whatsapp_bot_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policy for SELECT
CREATE POLICY "Users can view their own bot sessions" ON whatsapp_bot_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS Policy for INSERT
CREATE POLICY "Users can insert their own bot sessions" ON whatsapp_bot_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS Policy for UPDATE
CREATE POLICY "Users can update their own bot sessions" ON whatsapp_bot_sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS Policy for DELETE
CREATE POLICY "Users can delete their own bot sessions" ON whatsapp_bot_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_whatsapp_bot_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_whatsapp_bot_sessions_updated_at
  BEFORE UPDATE ON whatsapp_bot_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_whatsapp_bot_sessions_updated_at();

-- Log the migration
INSERT INTO chatbot_activity_logs (bot_id, user_id, event_type, message, data)
  SELECT 
    NULL,
    NULL,
    'migration',
    'Added TRUTH MD session support tables',
    jsonb_build_object(
      'migration', 'add-truthmd-sessions.sql',
      'timestamp', NOW(),
      'tables_created', ARRAY['whatsapp_bot_sessions']
    )
  WHERE NOT EXISTS (
    SELECT 1 FROM chatbot_activity_logs 
    WHERE event_type = 'migration' 
    AND message LIKE '%TRUTH MD session support%'
  );
