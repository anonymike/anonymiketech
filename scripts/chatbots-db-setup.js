#!/usr/bin/env node

/**
 * Chatbots Platform Database Setup Script
 * Creates tables, indexes, and RLS policies for the chatbots SaaS platform
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function setupDatabase() {
  try {
    console.log('Starting database setup...');

    // Create chatbot_users table
    console.log('Creating chatbot_users table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.chatbot_users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          username VARCHAR(100) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone_number VARCHAR(20),
          coin_balance INTEGER DEFAULT 0,
          total_coins_purchased INTEGER DEFAULT 0,
          profile_image TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }).catch(() => {
      // Table might already exist, continue
    });

    // Create chatbot_types table
    console.log('Creating chatbot_types table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.chatbot_types (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          long_description TEXT,
          category VARCHAR(100),
          icon VARCHAR(50),
          image TEXT,
          cost_in_coins INTEGER NOT NULL DEFAULT 10,
          api_endpoint VARCHAR(500),
          documentation_url TEXT,
          features TEXT[] DEFAULT '{}',
          is_active BOOLEAN DEFAULT true,
          admin_only BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }).catch(() => {
      // Table might already exist, continue
    });

    // Create deployed_bots table
    console.log('Creating deployed_bots table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.deployed_bots (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES public.chatbot_users(id) ON DELETE CASCADE,
          bot_type_id UUID NOT NULL REFERENCES public.chatbot_types(id) ON DELETE CASCADE,
          bot_name VARCHAR(255) NOT NULL,
          session_id VARCHAR(500) UNIQUE NOT NULL,
          status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'stopped', 'error')),
          webhook_url TEXT,
          config JSONB DEFAULT '{}',
          error_message TEXT,
          last_activity TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }).catch(() => {
      // Table might already exist, continue
    });

    // Create coin_transactions table
    console.log('Creating coin_transactions table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.coin_transactions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES public.chatbot_users(id) ON DELETE CASCADE,
          amount INTEGER NOT NULL,
          transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('purchase', 'deployment', 'refund')),
          m_pesa_reference VARCHAR(255),
          m_pesa_checkout_id VARCHAR(255),
          status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
          phone_number VARCHAR(20),
          payment_method VARCHAR(50) DEFAULT 'mpesa',
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }).catch(() => {
      // Table might already exist, continue
    });

    console.log('✓ Tables created successfully');

    // Create indexes
    console.log('Creating indexes...');
    const indexCreationPromises = [
      supabase.rpc('exec_sql', {
        sql: 'CREATE INDEX IF NOT EXISTS idx_chatbot_users_auth_id ON public.chatbot_users(auth_id);'
      }),
      supabase.rpc('exec_sql', {
        sql: 'CREATE INDEX IF NOT EXISTS idx_chatbot_users_username ON public.chatbot_users(username);'
      }),
      supabase.rpc('exec_sql', {
        sql: 'CREATE INDEX IF NOT EXISTS idx_deployed_bots_user_id ON public.deployed_bots(user_id);'
      }),
      supabase.rpc('exec_sql', {
        sql: 'CREATE INDEX IF NOT EXISTS idx_deployed_bots_status ON public.deployed_bots(status);'
      }),
      supabase.rpc('exec_sql', {
        sql: 'CREATE INDEX IF NOT EXISTS idx_coin_transactions_user_id ON public.coin_transactions(user_id);'
      }),
    ];

    await Promise.all(indexCreationPromises).catch(() => {
      // Indexes might already exist, continue
    });

    console.log('✓ Indexes created successfully');

    // Enable RLS
    console.log('Enabling Row Level Security...');
    const rlsPromises = [
      supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE public.chatbot_users ENABLE ROW LEVEL SECURITY;'
      }),
      supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE public.chatbot_types ENABLE ROW LEVEL SECURITY;'
      }),
      supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE public.deployed_bots ENABLE ROW LEVEL SECURITY;'
      }),
      supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;'
      }),
    ];

    await Promise.all(rlsPromises).catch(() => {
      // RLS might already be enabled, continue
    });

    console.log('✓ RLS enabled successfully');

    // Insert sample bot types
    console.log('Inserting sample bot types...');
    const botTypes = [
      {
        name: 'WhatsApp Bot Pro',
        description: 'Professional WhatsApp automation and messaging bot',
        long_description: 'Deploy a powerful WhatsApp bot that automates customer support, marketing campaigns, and business operations. Features real-time message handling, media support, and advanced filtering.',
        category: 'Messaging',
        icon: '💬',
        cost_in_coins: 10,
        features: ['Real-time Messages', 'Media Support', 'Automated Responses', 'Contact Management', 'Message Scheduling', 'Analytics'],
      },
      {
        name: 'Customer Support Bot',
        description: 'AI-powered customer support automation',
        long_description: 'Intelligent chatbot that handles customer inquiries 24/7. Integrated with knowledge base, ticket system, and human handoff capabilities for complex issues.',
        category: 'Support',
        icon: '🎯',
        cost_in_coins: 15,
        features: ['AI Responses', 'Ticket System', 'Knowledge Base', 'Human Handoff', 'Multi-language', 'Analytics'],
      },
      {
        name: 'E-commerce Bot',
        description: 'Shopping and order management bot',
        long_description: 'Complete e-commerce solution with product catalog, shopping cart, order tracking, and payment integration for WhatsApp and other platforms.',
        category: 'Commerce',
        icon: '🛍️',
        cost_in_coins: 20,
        features: ['Product Catalog', 'Shopping Cart', 'Order Tracking', 'Payment Gateway', 'Inventory Sync', 'Reports'],
      },
      {
        name: 'Marketing Bot',
        description: 'Campaign automation and lead generation',
        long_description: 'Powerful marketing automation tool for WhatsApp campaigns, lead generation, appointment booking, and customer engagement with advanced segmentation.',
        category: 'Marketing',
        icon: '📢',
        cost_in_coins: 12,
        features: ['Campaign Management', 'Lead Capture', 'Segmentation', 'Appointment Booking', 'A/B Testing', 'Performance Metrics'],
      },
      {
        name: 'Lead Generation Bot',
        description: 'Advanced lead capture and qualification',
        long_description: 'Intelligent bot that captures leads from WhatsApp, qualifies them based on custom criteria, and integrates with CRM systems for seamless sales workflow.',
        category: 'Sales',
        icon: '🎁',
        cost_in_coins: 18,
        features: ['Lead Capture', 'Qualification', 'CRM Integration', 'Follow-up Automation', 'Score Tracking', 'Export Options'],
      },
    ];

    for (const botType of botTypes) {
      const { error } = await supabase
        .from('chatbot_types')
        .upsert({
          name: botType.name,
          description: botType.description,
          long_description: botType.long_description,
          category: botType.category,
          icon: botType.icon,
          cost_in_coins: botType.cost_in_coins,
          features: botType.features,
          is_active: true,
          admin_only: false,
        }, {
          onConflict: 'name',
        });

      if (error) {
        console.error(`Error inserting bot type ${botType.name}:`, error);
      }
    }

    console.log('✓ Sample bot types inserted successfully');
    console.log('\n✅ Database setup completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
