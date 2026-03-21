-- Add referral and password reset functionality to chatbots platform
-- This script adds three new features:
-- 1. User referral system with coin rewards
-- 2. Password reset functionality
-- 3. Additional user profile fields

-- Step 1: Add new columns to chatbot_users table
ALTER TABLE chatbot_users
ADD COLUMN referral_code TEXT UNIQUE,
ADD COLUMN invites_count INTEGER DEFAULT 0;

-- Step 2: Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES chatbot_users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Create user_referrals table
CREATE TABLE IF NOT EXISTS user_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES chatbot_users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES chatbot_users(id) ON DELETE CASCADE,
  reward_coins INTEGER DEFAULT 50,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(referrer_id, referred_user_id)
);

-- Step 4: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

CREATE INDEX IF NOT EXISTS idx_user_referrals_referrer_id ON user_referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_user_referrals_referred_user_id ON user_referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_user_referrals_status ON user_referrals(status);

CREATE INDEX IF NOT EXISTS idx_chatbot_users_referral_code ON chatbot_users(referral_code);

-- Step 5: Enable RLS (Row Level Security) on new tables if not already enabled
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for password_reset_tokens
DROP POLICY IF EXISTS password_reset_tokens_users_read ON password_reset_tokens;
CREATE POLICY password_reset_tokens_users_read ON password_reset_tokens
  FOR SELECT USING (true);

DROP POLICY IF EXISTS password_reset_tokens_users_insert ON password_reset_tokens;
CREATE POLICY password_reset_tokens_users_insert ON password_reset_tokens
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS password_reset_tokens_users_update ON password_reset_tokens;
CREATE POLICY password_reset_tokens_users_update ON password_reset_tokens
  FOR UPDATE USING (true) WITH CHECK (true);

-- Step 7: Create RLS policies for user_referrals
DROP POLICY IF EXISTS user_referrals_read ON user_referrals;
CREATE POLICY user_referrals_read ON user_referrals
  FOR SELECT USING (true);

DROP POLICY IF EXISTS user_referrals_insert ON user_referrals;
CREATE POLICY user_referrals_insert ON user_referrals
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS user_referrals_update ON user_referrals;
CREATE POLICY user_referrals_update ON user_referrals
  FOR UPDATE USING (true) WITH CHECK (true);
