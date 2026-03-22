import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function initializeDatabase() {
  try {
    console.log('[v0] Starting WhatsApp bot database initialization...')

    // Create whatsapp_bots table
    console.log('[v0] Creating whatsapp_bots table...')
    await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.whatsapp_bots (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          bot_name VARCHAR(255) NOT NULL,
          phone_number VARCHAR(20),
          template_id VARCHAR(255),
          status VARCHAR(50) DEFAULT 'inactive',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_whatsapp_bots_user_id ON public.whatsapp_bots(user_id);
      `
    }).catch(err => {
      // Table might already exist, that's ok
      console.log('[v0] whatsapp_bots table check completed')
    })

    // Create whatsapp_bot_config table
    console.log('[v0] Creating whatsapp_bot_config table...')
    await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.whatsapp_bot_config (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          bot_id UUID NOT NULL REFERENCES public.whatsapp_bots(id) ON DELETE CASCADE,
          system_prompt TEXT,
          welcome_message TEXT,
          commands JSONB,
          business_hours JSONB,
          whitelist_numbers TEXT[],
          rate_limit_per_hour INTEGER DEFAULT 100,
          rate_limit_per_day INTEGER DEFAULT 1000,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_config_bot_id ON public.whatsapp_bot_config(bot_id);
      `
    }).catch(err => {
      console.log('[v0] whatsapp_bot_config table check completed')
    })

    // Create whatsapp_deployment_config table
    console.log('[v0] Creating whatsapp_deployment_config table...')
    await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.whatsapp_deployment_config (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          bot_id UUID NOT NULL REFERENCES public.whatsapp_bots(id) ON DELETE CASCADE,
          platform VARCHAR(50),
          deployment_url VARCHAR(500),
          environment_variables JSONB,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_whatsapp_deployment_config_bot_id ON public.whatsapp_deployment_config(bot_id);
      `
    }).catch(err => {
      console.log('[v0] whatsapp_deployment_config table check completed')
    })

    // Create whatsapp_bot_sessions table
    console.log('[v0] Creating whatsapp_bot_sessions table...')
    await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.whatsapp_bot_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          bot_id UUID NOT NULL REFERENCES public.whatsapp_bots(id) ON DELETE CASCADE,
          session_key TEXT,
          qr_code TEXT,
          is_authenticated BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_sessions_bot_id ON public.whatsapp_bot_sessions(bot_id);
      `
    }).catch(err => {
      console.log('[v0] whatsapp_bot_sessions table check completed')
    })

    // Create whatsapp_bot_logs table
    console.log('[v0] Creating whatsapp_bot_logs table...')
    await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.whatsapp_bot_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          bot_id UUID NOT NULL REFERENCES public.whatsapp_bots(id) ON DELETE CASCADE,
          action VARCHAR(255),
          details JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_logs_bot_id ON public.whatsapp_bot_logs(bot_id);
      `
    }).catch(err => {
      console.log('[v0] whatsapp_bot_logs table check completed')
    })

    // Create whatsapp_bot_analytics table
    console.log('[v0] Creating whatsapp_bot_analytics table...')
    await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.whatsapp_bot_analytics (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          bot_id UUID NOT NULL REFERENCES public.whatsapp_bots(id) ON DELETE CASCADE,
          messages_sent INTEGER DEFAULT 0,
          messages_received INTEGER DEFAULT 0,
          unique_users INTEGER DEFAULT 0,
          date DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_whatsapp_bot_analytics_bot_id ON public.whatsapp_bot_analytics(bot_id);
      `
    }).catch(err => {
      console.log('[v0] whatsapp_bot_analytics table check completed')
    })

    console.log('[v0] Database initialization completed successfully!')
  } catch (error) {
    console.error('[v0] Database initialization error:', error)
    process.exit(1)
  }
}

initializeDatabase()
