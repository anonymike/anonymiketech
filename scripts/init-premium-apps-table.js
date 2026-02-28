import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function initializeTable() {
  try {
    console.log('Creating premium_apps table...')
    
    // Create table using SQL
    const { error: tableError } = await supabase.rpc('sql', {
      sql: `
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
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
        );
        
        ALTER TABLE public.premium_apps ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Enable read access for all users" ON public.premium_apps
          FOR SELECT USING (true);
        
        CREATE POLICY "Enable insert for all users" ON public.premium_apps
          FOR INSERT WITH CHECK (true);
        
        CREATE POLICY "Enable update for all users" ON public.premium_apps
          FOR UPDATE USING (true);
        
        CREATE POLICY "Enable delete for all users" ON public.premium_apps
          FOR DELETE USING (true);
      `
    })
    
    if (tableError && !tableError.message.includes('already exists')) {
      throw tableError
    }
    
    console.log('✓ Table created or already exists')
    
    // Insert sample data if table is empty
    console.log('Checking for existing data...')
    const { data: existingData } = await supabase
      .from('premium_apps')
      .select('id')
      .limit(1)
    
    if (!existingData || existingData.length === 0) {
      console.log('Inserting sample premium apps...')
      
      const sampleApps = [
        {
          name: 'Telegram Premium',
          description: 'Premium features for Telegram',
          long_description: 'Get unlimited cloud storage, exclusive stickers, and more with Telegram Premium',
          category: 'Messaging',
          icon: '💬',
          price: 100,
          features: ['Unlimited storage', 'Exclusive stickers', 'Advanced search', 'Priority support', 'No ads', 'Custom themes'],
          downloads: 1250,
          is_new: true
        },
        {
          name: 'Spotify Premium',
          description: 'Ad-free music streaming',
          long_description: 'Enjoy unlimited skips, offline downloads, and high-quality audio',
          category: 'Music',
          icon: '🎵',
          price: 100,
          features: ['Ad-free listening', 'Offline downloads', 'High audio quality', 'Unlimited skips', 'Family plans', 'Student discounts'],
          downloads: 2340,
          is_new: false
        },
        {
          name: 'Netflix Premium',
          description: 'Stream movies and shows',
          long_description: 'Watch in 4K, download content, and share with family',
          category: 'Entertainment',
          icon: '🎬',
          price: 100,
          features: ['4K streaming', 'Offline downloads', 'Multiple profiles', 'Ad-free', 'Early releases', 'Exclusive content'],
          downloads: 3100,
          is_new: false
        },
        {
          name: 'Truecaller Pro',
          description: 'Block spam and identify calls',
          long_description: 'Advanced call blocking and spam detection with premium features',
          category: 'Utilities',
          icon: '☎️',
          price: 100,
          features: ['Spam blocking', 'Call recording', 'ID fake calls', 'Contact sync', 'Premium support', 'Call waiting'],
          downloads: 890,
          is_new: false
        },
        {
          name: 'Adobe Creative Cloud',
          description: 'Professional design tools',
          long_description: 'Photoshop, Illustrator, Premiere and more for creators',
          category: 'Design',
          icon: '🎨',
          price: 100,
          features: ['Photoshop', 'Illustrator', 'Premiere Pro', 'Cloud storage', 'Mobile apps', 'Templates'],
          downloads: 567,
          is_new: false
        },
        {
          name: 'Microsoft Office 365',
          description: 'Complete office suite',
          long_description: 'Word, Excel, PowerPoint, and more with cloud storage',
          category: 'Productivity',
          icon: '📊',
          price: 100,
          features: ['Word & Excel', 'PowerPoint', 'OneNote', 'Cloud storage', 'Collaboration', 'Desktop & Mobile'],
          downloads: 4200,
          is_new: false
        }
      ]
      
      const { error: insertError } = await supabase
        .from('premium_apps')
        .insert(sampleApps)
      
      if (insertError) throw insertError
      console.log('✓ Sample apps inserted')
    } else {
      console.log('✓ Table already has data')
    }
    
    console.log('\n✓ Premium apps table initialized successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error initializing table:', error)
    process.exit(1)
  }
}

initializeTable()
