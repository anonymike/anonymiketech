# TRUTH-MD Bot Marketplace Platform

This document outlines the complete TRUTH-MD WhatsApp bot integration with AnonymiKey, including bot templates, QR authentication, worker infrastructure, real-time monitoring, and media support.

## Overview

The platform enables users to:
- Deploy pre-built bot templates (like TRUTH-MD) to their WhatsApp accounts
- Authenticate via QR code scanning (no session token exposure)
- Manage multiple bot instances with real-time status monitoring
- View live logs and metrics
- Handle media files (images, videos, audio, documents)
- Scale to multiple deployment environments (Heroku, Railway, Docker)

## Architecture

### Core Components

```
AnonymiKey Platform
├── Dashboard & UI (React Components)
├── Bot Marketplace (Template System)
├── Authentication System (QR-based)
├── Bot Runner (Instance Manager)
├── Session Manager (Persistence)
├── Media Processor (File Handling)
├── Monitoring (Logs & Metrics)
└── API Routes (REST Endpoints)
```

## Implementation Files

### Phase 1: Template Registration

**File**: `scripts/register-truthmd-template.sql`
- Registers TRUTH-MD as a marketplace template
- Defines bot features and capabilities
- Sets up configuration schemas

**File**: `lib/truthmd-bot-config.ts`
- TRUTH-MD configuration schema
- Default settings for AI, commands, rate limiting
- Feature definitions

### Phase 2: QR Code Authentication

**File**: `lib/whatsapp-qr-auth.ts`
- QR code generation using Baileys library
- WhatsApp Web multi-device authentication
- Session initialization and management
- Auto-reconnection logic

**File**: `app/api/chatbots/whatsapp/auth/qr/route.ts`
- API endpoint for QR auth lifecycle
- `initiate` - Start QR authentication
- `status` - Poll connection status
- `disconnect` - Terminate session

**File**: `components/WhatsAppQRAuth.tsx`
- React component for QR code display
- Real-time status polling
- Session management UI

### Phase 3: Bot Runner Infrastructure

**File**: `lib/bot-runner.ts`
- Bot instance lifecycle management
- Singleton runner manager
- Event emitters for state changes
- Log aggregation
- Metrics collection

**File**: `app/api/chatbots/whatsapp/bots/control/route.ts`
- Bot control API (start, stop, pause, resume)
- Instance status checking
- Error handling

**File**: `app/api/chatbots/whatsapp/bots/logs/route.ts`
- Log retrieval and streaming
- Server-Sent Events for real-time logs
- Log filtering and export

**File**: `app/api/chatbots/whatsapp/bots/metrics/route.ts`
- Metrics API for uptime, message counts, errors
- Real-time metrics updates

### Phase 4: Dashboard & UI

**File**: `components/BotStatusCard.tsx`
- Bot status display card
- Start/stop/pause/resume controls
- Uptime tracking
- Quick status refresh

**File**: `components/BotLogsViewer.tsx`
- Real-time log viewer
- Level-based filtering
- Log export functionality
- SSE streaming

**File**: `components/BotMetricsDashboard.tsx`
- Metrics visualization
- Uptime, message counts, errors
- CPU/memory usage (when available)

**File**: `components/BotManagementDashboard.tsx`
- Main bot management interface
- Multi-tab layout (Overview, Metrics, Logs)
- Bot grid display

### Phase 5: Session & Media Management

**File**: `lib/session-manager.ts`
- Session persistence across restarts
- Credential storage (file-based + database)
- Session cleanup and expiration
- Multi-bot session tracking

**File**: `lib/media-processor.ts`
- Media file handling
- Image resizing and compression
- Video thumbnail extraction
- Media metadata extraction
- Automatic cleanup of old files

**File**: `app/api/chatbots/whatsapp/media/route.ts`
- Media upload endpoint
- Media processing and retrieval
- Media deletion
- Message media listing

## Database Schema

The platform uses Supabase with the following tables:

```sql
-- Bots table
CREATE TABLE whatsapp_bots (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  template_id TEXT,
  name TEXT NOT NULL,
  phone_number TEXT,
  status TEXT DEFAULT 'inactive',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Bot sessions table
CREATE TABLE bot_sessions (
  session_id TEXT PRIMARY KEY,
  bot_id UUID REFERENCES whatsapp_bots,
  qr_code TEXT,
  is_connected BOOLEAN DEFAULT FALSE,
  phone_number TEXT,
  connection_status TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Bot logs table
CREATE TABLE bot_logs (
  id TEXT PRIMARY KEY,
  bot_id UUID REFERENCES whatsapp_bots,
  level TEXT,
  message TEXT,
  metadata JSONB,
  created_at TIMESTAMP
);

-- Media files table
CREATE TABLE media_files (
  id TEXT PRIMARY KEY,
  bot_id UUID REFERENCES whatsapp_bots,
  message_id TEXT,
  type TEXT,
  mime_type TEXT,
  filename TEXT,
  size INTEGER,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Bot templates table
CREATE TABLE bot_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  features JSONB,
  configuration JSONB,
  created_at TIMESTAMP
);
```

## API Reference

### Authentication

**POST** `/api/chatbots/whatsapp/auth/qr`
- Initiate, check status, or disconnect QR authentication

```json
{
  "action": "initiate|status|disconnect",
  "botId": "string",
  "sessionId": "string",
  "userId": "string"
}
```

### Bot Control

**POST** `/api/chatbots/whatsapp/bots/control`
- Start, stop, pause, or resume bot instances

```json
{
  "action": "start|stop|pause|resume|status",
  "botId": "string",
  "userId": "string"
}
```

### Logs

**GET** `/api/chatbots/whatsapp/bots/logs?botId=<id>&userId=<id>&stream=true`
- Retrieve or stream bot logs via SSE

### Metrics

**GET** `/api/chatbots/whatsapp/bots/metrics?botId=<id>&userId=<id>`
- Get current bot metrics

**POST** `/api/chatbots/whatsapp/bots/metrics`
- Update bot metrics

### Media

**POST** `/api/chatbots/whatsapp/media`
- Upload media file

**GET** `/api/chatbots/whatsapp/media?action=get|list&mediaId=<id>&botId=<id>`
- Retrieve media or list message media

**DELETE** `/api/chatbots/whatsapp/media?mediaId=<id>&botId=<id>&userId=<id>`
- Delete media file

## Setup Instructions

### 1. Prerequisites

```bash
npm install @whiskeysockets/baileys qrcode
npm install --save-dev @types/node
```

### 2. Database Setup

Run the migration script to create tables:

```bash
# When database is connected:
node scripts/register-truthmd-template.sql
```

### 3. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Deploy Bots

Use the bot management dashboard to:
1. Create new bot instance from TRUTH-MD template
2. Scan QR code to authenticate WhatsApp session
3. Configure bot settings
4. Start bot instance
5. Monitor via logs and metrics

## QR Authentication Flow

```
User Initiates Auth
    ↓
Backend generates QR code (Baileys makeWASocket)
    ↓
Frontend displays QR in dashboard
    ↓
User scans with WhatsApp app
    ↓
Backend detects connection
    ↓
Session saved to database & file
    ↓
Bot marked as authenticated/connected
```

## Bot Lifecycle

```
STOPPED
  ↓ (start)
RUNNING
  ↓ (pause)
PAUSED
  ↓ (resume)
RUNNING
  ↓ (stop)
STOPPED

OR at any state:
  → ERROR (connection lost, auth failure)
```

## Log Streaming with SSE

The logs API uses Server-Sent Events for real-time updates:

```javascript
// Client-side
const eventSource = new EventSource('/api/chatbots/whatsapp/bots/logs?botId=xxx&stream=true');

eventSource.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'initial_logs') {
    // Handle initial logs array
  } else if (data.type === 'new_log') {
    // Handle individual log entry
  }
});
```

## Media Processing

Supported formats:
- **Images**: JPEG, PNG, WebP, GIF
- **Video**: MP4, WebM, MOV
- **Audio**: MP3, M4A, OGG, WAV
- **Documents**: PDF, DOCX, TXT, XLS

Processing includes:
- Metadata extraction
- Compression
- Resizing (images)
- Thumbnail generation (videos)
- Automatic cleanup (30-day retention)

## Deployment Options

### Option 1: Direct Server (Current)
- Bot runs on main application server
- Suitable for small-scale deployments
- Simpler setup

### Option 2: Heroku
- Separate Heroku dyno per bot
- Auto-scaling capability
- Environment variable management

### Option 3: Railway
- Docker-based deployment
- Multi-region support
- Built-in monitoring

### Option 4: Docker
- Custom container orchestration
- Full control over resources
- Kubernetes ready

## Security Considerations

1. **Session Credentials**: Encrypted storage with base64 encoding
2. **QR Codes**: Expire after 2 minutes
3. **Media Files**: Isolated per bot, cleanup after 30 days
4. **API Authentication**: User ID verification on all endpoints
5. **Row-Level Security**: Supabase RLS policies enforce user isolation

## Monitoring & Maintenance

### Scheduled Tasks

```bash
# Cleanup expired sessions (hourly)
sessionManager.cleanupExpiredSessions()

# Cleanup old media files (daily)
mediaProcessor.cleanupOldMedia(30)

# Log cleanup (automatic in BotRunnerManager)
```

### Metrics to Track

- Bot uptime
- Message processing rate
- Error frequency
- Resource usage (CPU, memory)
- Active bot instances
- Media file storage

## Troubleshooting

### QR Code Doesn't Appear
- Verify Baileys library is installed
- Check session directory permissions
- Review console logs for connection errors

### Bot Stops Unexpectedly
- Check logs for authentication failures
- Verify WhatsApp account not logged elsewhere
- Review rate limiting settings

### Media Upload Fails
- Check file size limits
- Verify MIME type support
- Ensure media directory writable

### Session Lost on Restart
- Verify session directory persistence
- Check database connection
- Review credential file integrity

## Next Steps

1. **Connect Database**: Set up Supabase integration
2. **Deploy Infrastructure**: Choose deployment option
3. **Configure Media Processing**: Install sharp/ffmpeg for advanced processing
4. **Setup Scaling**: Implement Redis for session sharing across instances
5. **Advanced Analytics**: Integrate PostHog or similar for usage tracking

## Support

For issues or questions:
- Check logs in the dashboard
- Review this documentation
- Open support ticket at vercel.com/help
