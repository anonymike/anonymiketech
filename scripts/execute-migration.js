import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[v0] Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function runMigration() {
  try {
    console.log('[v0] Starting column migration...');

    // Execute the migration SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE premium_apps 
        ADD COLUMN IF NOT EXISTS installation_instructions JSONB DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS system_requirements JSONB DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS version_history JSONB DEFAULT NULL;
      `
    }).catch(() => {
      // Fallback if RPC function doesn't exist - try with regular query
      return { data: null, error: 'RPC not available' };
    });

    if (error && error.includes('RPC not available')) {
      console.log('[v0] RPC function not available, attempting direct query...');
      // Try direct table modification via Supabase admin API
      const { error: directError } = await supabase.from('premium_apps').select('id').limit(1);
      
      if (!directError) {
        console.log('[v0] ✓ Table exists and is accessible');
        console.log('[v0] Please run this SQL in Supabase SQL Editor:');
        console.log(`
ALTER TABLE premium_apps 
ADD COLUMN IF NOT EXISTS installation_instructions JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS system_requirements JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS version_history JSONB DEFAULT NULL;
        `);
      }
    } else if (error) {
      console.error('[v0] Migration error:', error);
    } else {
      console.log('[v0] ✓ Columns added successfully!');
    }
  } catch (err) {
    console.error('[v0] Script error:', err.message);
  }
}

runMigration();
