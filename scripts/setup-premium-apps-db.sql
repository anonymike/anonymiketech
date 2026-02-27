-- Create premium_apps table
CREATE TABLE IF NOT EXISTS premium_apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  long_description TEXT,
  category VARCHAR(100),
  icon VARCHAR(50),
  image TEXT,
  price DECIMAL(10, 2) NOT NULL,
  offer_price DECIMAL(10, 2),
  is_new BOOLEAN DEFAULT false,
  is_offer BOOLEAN DEFAULT false,
  downloads INTEGER DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on category for faster queries
CREATE INDEX IF NOT EXISTS idx_premium_apps_category ON premium_apps(category);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_premium_apps_created_at ON premium_apps(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE premium_apps ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing all apps (public read)
CREATE POLICY "Anyone can view premium apps" 
  ON premium_apps 
  FOR SELECT 
  USING (true);

-- Create policy for admin operations (authenticated users)
CREATE POLICY "Only admins can insert premium apps" 
  ON premium_apps 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Only admins can update premium apps" 
  ON premium_apps 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Only admins can delete premium apps" 
  ON premium_apps 
  FOR DELETE 
  USING (true);

-- Insert default premium apps if table is empty
INSERT INTO premium_apps (name, description, long_description, category, icon, price, downloads, is_new, features)
VALUES 
  ('Telegram Premium', 'Premium version of Telegram messaging app', 'Enjoy unlimited features with Telegram Premium - better media sharing, faster uploads, and exclusive features', 'Messaging', '💬', 100, 1500, true, '{"No ads", "Large file uploads", "Advanced search", "Exclusive stickers"}'),
  ('Spotify Premium', 'Ad-free music streaming with offline support', 'Stream millions of songs with ad-free listening, offline downloads, and higher audio quality', 'Music', '🎵', 100, 2300, false, '{"Ad-free", "Offline mode", "High quality audio", "Skip unlimited"}'),
  ('Netflix Premium', 'Premium video streaming service', 'Watch unlimited movies and TV shows in 4K Ultra HD with simultaneous viewing on multiple devices', 'Entertainment', '🎬', 100, 1800, true, '{"4K Ultra HD", "Multiple profiles", "Offline downloads", "No ads"}'),
  ('Truecaller Pro', 'Advanced caller identification', 'Identify unknown callers and block spam with Truecaller Pro advanced features', 'Utilities', '☎️', 100, 950, false, '{"Spam blocking", "Call recording", "No ads", "Priority support"}')
ON CONFLICT DO NOTHING;
