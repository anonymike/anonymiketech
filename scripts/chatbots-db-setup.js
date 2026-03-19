#!/usr/bin/env node

/**
 * Chatbots Platform Database Setup Script (Manual SQL Method)
 * 
 * This script provides instructions for running the chatbots-migration.sql
 * Run the SQL file directly in your Supabase SQL Editor instead of using this script
 */

const fs = require('fs');
const path = require('path');

const sqlFilePath = path.join(__dirname, 'chatbots-migration.sql');

if (!fs.existsSync(sqlFilePath)) {
  console.error('Error: chatbots-migration.sql file not found');
  process.exit(1);
}

const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

console.log('✅ Chatbots Database Migration Guide\n');
console.log('To set up the chatbots platform database, follow these steps:\n');

console.log('1. Go to your Supabase Dashboard');
console.log('2. Navigate to SQL Editor');
console.log('3. Create a new query');
console.log('4. Copy and paste the following SQL code:\n');
console.log('─'.repeat(80));
console.log(sqlContent);
console.log('─'.repeat(80));
console.log('\n5. Execute the SQL (Ctrl+Enter or Cmd+Enter)');
console.log('6. Wait for the execution to complete');
console.log('7. Your database is now ready for the chatbots platform!\n');

console.log('✅ Once done, you can use the chatbots platform API endpoints.');
console.log('📚 See CHATBOTS_SETUP.md for more information.\n');
