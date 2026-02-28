-- Create premium_apps table
CREATE TABLE IF NOT EXISTS public.premium_apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  long_description TEXT,
  category VARCHAR(100),
  icon VARCHAR(10),
  image TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  offer_price INTEGER,
  is_new BOOLEAN DEFAULT false,
  is_offer BOOLEAN DEFAULT false,
  features TEXT[] DEFAULT '{}',
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_premium_apps_name ON public.premium_apps(name);
CREATE INDEX IF NOT EXISTS idx_premium_apps_category ON public.premium_apps(category);
CREATE INDEX IF NOT EXISTS idx_premium_apps_is_new ON public.premium_apps(is_new);
CREATE INDEX IF NOT EXISTS idx_premium_apps_is_offer ON public.premium_apps(is_offer);

-- Enable RLS (Row Level Security)
ALTER TABLE public.premium_apps ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public read access" ON public.premium_apps
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert" ON public.premium_apps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update" ON public.premium_apps
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete" ON public.premium_apps
  FOR DELETE USING (true);

-- Insert sample data (optional)
INSERT INTO public.premium_apps (name, description, long_description, category, icon, price, features, downloads, is_new)
VALUES
  (
    'Advanced Password Generator',
    'Generate secure passwords',
    'Professional password generation tool with customizable options',
    'Developer Tools',
    '🔐',
    100,
    '{"Secure generation", "Custom length", "Special characters", "Copy to clipboard", "History", "Strength indicator"}',
    1250,
    true
  ),
  (
    'Pro Code Formatter',
    'Format code in 20+ languages',
    'Professional code formatting for multiple programming languages',
    'Developer Tools',
    '✨',
    100,
    '{"20+ languages", "Auto format", "Custom rules", "Syntax highlighting", "Bulk formatting", "Preview"}',
    856,
    false
  ),
  (
    'JSON Validator Pro',
    'Validate and format JSON',
    'Complete JSON validation and formatting solution',
    'Developer Tools',
    '📋',
    100,
    '{"Real-time validation", "Format JSON", "Error detection", "Tree view", "Export options", "Beautify"}',
    634,
    false
  ),
  (
    'Regex Master Tester',
    'Test regular expressions',
    'Advanced regex testing and learning tool',
    'Developer Tools',
    '🎯',
    100,
    '{"Pattern testing", "Match highlighting", "Replace function", "Documentation", "Examples", "Export matches"}',
    445,
    false
  ),
  (
    'API Client Pro',
    'REST API testing tool',
    'Professional API client for testing REST endpoints',
    'Developer Tools',
    '🌐',
    100,
    '{"HTTP methods", "Headers management", "Authentication", "Response preview", "History", "Collections"}',
    723,
    true
  ),
  (
    'Cryptographic Hash Generator',
    'Hash generation & verification',
    'Generate and verify cryptographic hashes',
    'Developer Tools',
    '🔑',
    100,
    '{"MD5, SHA1, SHA256", "Verification", "Bulk hashing", "File upload", "Copy results", "Algorithm info"}',
    567,
    false
  )
ON CONFLICT DO NOTHING;
