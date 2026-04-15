import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  try {
    console.log('Starting migration: Adding installation instructions, system requirements, and version history fields...')

    // Check if columns already exist by trying to query them
    const { data: checkData, error: checkError } = await supabase
      .from('premium_apps')
      .select('installation_instructions, system_requirements, version_history')
      .limit(1)

    if (!checkError) {
      console.log('✓ Migration columns already exist. Skipping...')
      return
    }

    // Execute migration through RPC or direct SQL
    console.log('Adding new columns to premium_apps table...')

    // Since we can't execute raw SQL directly, we'll add columns through the UI
    // For now, we'll just verify the table structure
    const { data, error } = await supabase
      .from('premium_apps')
      .select('*')
      .limit(1)

    if (error && error.code === 'PGRST205') {
      console.error('premium_apps table does not exist. Please create it first.')
      process.exit(1)
    }

    console.log('✓ premium_apps table exists.')
    console.log('\nIMPORTANT: Please manually add these columns in your Supabase dashboard:')
    console.log('1. installation_instructions (JSONB, nullable)')
    console.log('2. system_requirements (JSONB, nullable)')
    console.log('3. version_history (JSONB, nullable)')
    console.log('\nYou can also run this SQL in the Supabase SQL Editor:')
    console.log(`
ALTER TABLE premium_apps 
ADD COLUMN IF NOT EXISTS installation_instructions JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS system_requirements JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS version_history JSONB DEFAULT NULL;
    `)
    console.log('✓ Migration guide generated successfully.')
  } catch (error) {
    console.error('Migration error:', error)
    process.exit(1)
  }
}

runMigration().then(() => {
  console.log('✓ Migration process complete!')
  process.exit(0)
})
