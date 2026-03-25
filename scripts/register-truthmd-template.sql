-- ======================================
-- Register TRUTH-MD WhatsApp Bot Template
-- ======================================

INSERT INTO whatsapp_bot_templates (
  name,
  description,
  long_description,
  category,
  icon,
  image,
  github_repo_url,
  documentation_url,
  features,
  supported_deployment_types,
  is_active
) VALUES (
  'TRUTH-MD',
  'Advanced WhatsApp AI Assistant with multi-device support',
  'TRUTH-MD is a powerful WhatsApp bot framework built on Baileys library, offering multi-device WhatsApp Web connection, AI-powered message processing, media handling, command processing, and extensive customization. Perfect for building automated customer service, support bots, or AI assistants.',
  'AI Assistant',
  'https://i.ibb.co/nqsRcDB/XPloader4.jpg',
  'https://i.ibb.co/nqsRcDB/XPloader4.jpg',
  'https://github.com/Courtney250/TRUTH-MD',
  'https://github.com/Courtney250/TRUTH-MD/blob/main/README.md',
  ARRAY[
    'Message Processing',
    'Command Handling',
    'Media Support (Images, Videos, Audio, Documents)',
    'AI-Powered Responses',
    'Custom Commands',
    'Message Scheduling',
    'Group & Private Chat Support',
    'Rate Limiting',
    'Session Persistence',
    'Error Handling & Logging',
    'Webhook Integration',
    'Multi-Instance Support'
  ]::TEXT[],
  ARRAY['docker', 'heroku', 'railway', 'render', 'vps']::TEXT[],
  true
) ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  category = EXCLUDED.category,
  image = EXCLUDED.image,
  github_repo_url = EXCLUDED.github_repo_url,
  documentation_url = EXCLUDED.documentation_url,
  features = EXCLUDED.features,
  supported_deployment_types = EXCLUDED.supported_deployment_types,
  is_active = EXCLUDED.is_active,
  updated_at = CURRENT_TIMESTAMP
RETURNING id, name, category;
