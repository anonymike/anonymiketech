-- Create premium_apps table
CREATE TABLE IF NOT EXISTS public.premium_apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  long_description TEXT,
  category VARCHAR(100),
  icon VARCHAR(10),
  image TEXT,
  price INTEGER NOT NULL DEFAULT 100,
  offer_price INTEGER,
  is_new BOOLEAN DEFAULT false,
  is_offer BOOLEAN DEFAULT false,
  features TEXT[] DEFAULT '{}',
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.premium_apps ENABLE ROW LEVEL SECURITY;

-- Create policy for reading (anyone can read)
CREATE POLICY "Enable read access for all users" ON public.premium_apps
  FOR SELECT USING (true);

-- Create policy for inserting (authenticated users only)
CREATE POLICY "Enable insert for authenticated users only" ON public.premium_apps
  FOR INSERT WITH CHECK (true);

-- Create policy for updating (authenticated users only)
CREATE POLICY "Enable update for authenticated users only" ON public.premium_apps
  FOR UPDATE USING (true) WITH CHECK (true);

-- Create policy for deleting (authenticated users only)
CREATE POLICY "Enable delete for authenticated users only" ON public.premium_apps
  FOR DELETE USING (true);

-- Insert sample data if table is empty
INSERT INTO public.premium_apps (name, description, long_description, category, icon, price, downloads, features, is_new)
VALUES
  ('Telegram Premium', 'Advanced messaging features and tools', 'Premium version of Telegram with enhanced features, no ads, and exclusive tools for power users.', 'Messaging', '💬', 100, 1250, ARRAY['No Ads', 'Advanced Search', 'Higher Upload Limits', 'Custom Themes', 'Exclusive Stickers', 'Priority Support'], true),
  ('Spotify Premium', 'Unlimited music streaming without ads', 'Listen to millions of songs, create and share playlists, and enjoy offline downloads with Spotify Premium.', 'Music', '🎵', 100, 2840, ARRAY['Ad-Free Listening', 'Offline Downloads', 'Unlimited Skips', 'Higher Audio Quality', 'Share Playlists', 'Podcasts'], false),
  ('Netflix', 'Unlimited movies and TV shows', 'Stream thousands of movies and TV shows, watch on multiple devices, and download for offline viewing.', 'Entertainment', '🎬', 100, 3120, ARRAY['HD Quality', 'Multiple Profiles', 'Offline Viewing', 'Ad-Free', '4K Support', 'Simultaneous Streams'], false),
  ('Truecaller Pro', 'Advanced caller identification', 'Identify unknown callers, block spam calls, and get detailed caller information with Truecaller Pro.', 'Utilities', '☎️', 100, 890, ARRAY['Caller ID', 'Spam Blocking', 'Search Feature', 'Call Recording', 'Search History', 'Customer Support'], false),
  ('Adobe Creative Cloud', 'Professional design and video tools', 'Access Photoshop, Illustrator, Premiere Pro, and more creative applications for professionals.', 'Design', '🎨', 100, 1560, ARRAY['Photoshop', 'Illustrator', 'Premiere Pro', 'Cloud Storage', 'Templates', 'Tutorials'], false),
  ('Microsoft 365', 'Complete office and productivity suite', 'Get Word, Excel, PowerPoint, Teams, and cloud storage with 1TB of storage per user.', 'Productivity', '📊', 100, 2100, ARRAY['Word & Excel', 'Teams', '1TB Cloud Storage', 'Email Support', 'Updates', 'Offline Access'], false)
ON CONFLICT DO NOTHING;
