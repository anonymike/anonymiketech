# TRUTH-MD Bot Platform Setup Guide

Complete setup instructions for deploying the TRUTH-MD WhatsApp bot marketplace platform.

## Installation

### Step 1: Install Required Dependencies

```bash
npm install @whiskeysockets/baileys qrcode
npm install --save-dev @types/node
```

### Optional: Enhanced Media Processing

For advanced image and video processing:

```bash
# Image processing
npm install sharp

# Video processing
npm install fluent-ffmpeg

# FFmpeg system binary (required for video processing)
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

## Configuration

### 1. Database Integration

Connect your Supabase instance:

1. Go to project Settings (top right)
2. Click "Vars" section
3. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   SUPABASE_SERVICE_ROLE_KEY=your_key
   ```

### 2. Create Database Tables

When ready to connect the database, execute the migration:

```bash
# Option A: Using v0 system action (when database connected)
# Run the script: scripts/register-truthmd-template.sql

# Option B: Manual SQL execution in Supabase dashboard
# Copy content from the script and run in SQL editor
```

The script creates:
- `whatsapp_bots` - Bot instances
- `bot_sessions` - WhatsApp session data
- `bot_logs` - Activity logs
- `bot_templates` - Bot marketplace templates
- `media_files` - Uploaded media metadata

### 3. Directory Structure

The application creates these directories automatically:

```
project_root/
├── .auth/                    # WhatsApp session data
│   └── {botId}/{sessionId}/
├── .sessions/                # Session persistence
├── .media/                   # Media file storage
│   ├── temp/
│   ├── processed/
│   └── {botId}/
└── .logs/                    # Log archives (optional)
```

**Note**: Add these to `.gitignore`:
```
.auth/
.sessions/
.media/
.logs/
```

## Architecture Overview

### Component Breakdown

| Component | File | Purpose |
|-----------|------|---------|
| **QR Auth** | `lib/whatsapp-qr-auth.ts` | Baileys integration, QR generation |
| **Bot Runner** | `lib/bot-runner.ts` | Instance lifecycle, logging, metrics |
| **Session Manager** | `lib/session-manager.ts` | Credential persistence, expiry |
| **Media Processor** | `lib/media-processor.ts` | File handling, processing, cleanup |
| **QR Component** | `components/WhatsAppQRAuth.tsx` | Frontend QR display |
| **Status Card** | `components/BotStatusCard.tsx` | Bot control UI |
| **Logs Viewer** | `components/BotLogsViewer.tsx` | Real-time logs, SSE |
| **Metrics** | `components/BotMetricsDashboard.tsx` | Usage analytics |
| **Dashboard** | `components/BotManagementDashboard.tsx` | Main management interface |

### API Routes

| Endpoint | File | Purpose |
|----------|------|---------|
| `/api/chatbots/whatsapp/auth/qr` | `app/api/.../qr/route.ts` | QR auth lifecycle |
| `/api/chatbots/whatsapp/bots/control` | `app/api/.../control/route.ts` | Bot start/stop/pause |
| `/api/chatbots/whatsapp/bots/logs` | `app/api/.../logs/route.ts` | Log retrieval & streaming |
| `/api/chatbots/whatsapp/bots/metrics` | `app/api/.../metrics/route.ts` | Metrics API |
| `/api/chatbots/whatsapp/media` | `app/api/.../media/route.ts` | Media operations |

## Workflow

### 1. User Deploys Bot

```
Dashboard → "Deploy New Bot"
  ↓
Select Template (TRUTH-MD)
  ↓
Configure Settings
  ↓
Create Instance
```

### 2. QR Authentication

```
Backend initiates: POST /auth/qr { action: 'initiate' }
  ↓
QR code generated & stored
  ↓
Frontend polls: GET /auth/qr { action: 'status' }
  ↓
User scans with WhatsApp
  ↓
Session connected & persisted
  ↓
Bot ready to start
```

### 3. Run Bot

```
User clicks "Start"
  ↓
POST /bots/control { action: 'start' }
  ↓
BotRunnerManager.startBot()
  ↓
Instance created & tracked
  ↓
Status: running
```

### 4. Monitor Bot

```
Real-time tabs:
├── Logs (SSE streaming)
├── Metrics (10s refresh)
└── Overview (status cards)
```

## Key Features

### QR Authentication
- No session token exposure
- Automatic reconnection
- 2-minute QR expiry
- Multi-device support via Baileys

### Bot Management
- Start/stop/pause/resume controls
- Real-time status
- Uptime tracking
- Error detection

### Session Persistence
- Encrypted credential storage
- File + database backup
- 30-day auto-expiry
- Cleanup on deletion

### Media Support
- Images, videos, audio, documents
- Metadata extraction
- Compression & resizing (with sharp/ffmpeg)
- 30-day retention with auto-cleanup

### Monitoring
- Real-time logs via SSE
- Metrics dashboard
- Export functionality
- Level-based filtering

## Security Checklist

- [ ] Database RLS policies enabled
- [ ] Environment variables set securely
- [ ] .auth/, .sessions/, .media/ in .gitignore
- [ ] API endpoint user verification
- [ ] CORS properly configured
- [ ] Session expiry enabled (30 days)
- [ ] Media cleanup scheduled
- [ ] Credentials encrypted before storage

## Development Tips

### Testing QR Auth

```typescript
// Test without scanning - use mock data
const mockSession = await sessionManager.createSession(botId, sessionId)
await sessionManager.markAsConnected(sessionId, '+1234567890')
```

### Debug Mode

Enable debug logs:
```typescript
console.log("[v0] Debug message", data)
```

These will appear in preview logs for troubleshooting.

### Local Testing

1. Start dev server: `npm run dev`
2. Go to bot management page
3. Click "Deploy New Bot"
4. Test QR flow without database
5. Verify component rendering
6. Check console for errors

## Deployment

### Development
```bash
npm run dev
# Visit http://localhost:3000
```

### Production (Vercel)
```bash
# Connect GitHub repo
# Push changes to main
# Vercel auto-deploys
```

### Custom Server
```bash
npm run build
npm start
```

## Scaling Considerations

### Single Server (Current)
- Suitable for <50 concurrent bots
- All state in memory
- Simple setup

### Multi-Server Setup (Future)
- Redis for session sharing
- Database for state sync
- Load balancer frontend
- Docker containers

### Database Load
- Indexes on frequently queried columns
- Archive old logs monthly
- Cleanup media files regularly

## Troubleshooting

### "Table not found" Error
**Solution**: Database not connected. Execute migration script when database is ready.

### QR Code Doesn't Generate
**Solution**: 
- Check Baileys library installed
- Verify socket.ev listeners attached
- Check console for connection errors

### Bot Won't Start
**Solution**:
- Verify session authenticated (check `is_connected`)
- Review logs for error messages
- Check WhatsApp account active

### Media Upload Fails
**Solution**:
- Verify media directory writable
- Check file size < 100MB
- Confirm MIME type supported

### Memory Usage Growing
**Solution**:
- Logs auto-limit to 1000 entries per bot
- Media files auto-cleanup after 30 days
- Restart bot instance to clear memory

## Performance Tips

1. **Log Management**: Keep in-memory logs under 10,000 per bot
2. **Media Cleanup**: Run cleanup script daily
3. **Session Cleanup**: Run cleanup script weekly
4. **Database**: Index bot_id, user_id, created_at
5. **API Rate Limiting**: Implement on status polling

## Monitoring

### Key Metrics to Track
- Active bot count
- Messages processed/hour
- Authentication success rate
- Media files stored
- API response time
- Database query time
- Memory usage
- CPU usage

### Recommended Tools
- PostHog (product analytics)
- Sentry (error tracking)
- Datadog (infrastructure monitoring)
- Supabase stats (database metrics)

## Next Steps

1. ✅ Files created - Infrastructure ready
2. ⏳ Connect database - Enable persistence
3. ⏳ Test QR flow - Verify authentication
4. ⏳ Deploy bots - Run instances
5. ⏳ Setup monitoring - Track performance
6. ⏳ Scale infrastructure - Multi-server setup

## Support Resources

- **Baileys**: https://github.com/whiskeysockets/Baileys
- **WhatsApp Web**: https://web.whatsapp.com
- **Supabase Docs**: https://supabase.com/docs
- **Next.js 16**: https://nextjs.org/docs
- **v0 Platform**: https://v0.dev

## Success Checklist

- [ ] All files created successfully
- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] Database connected (when ready)
- [ ] QR auth flow tested
- [ ] Bot instance created
- [ ] Dashboard displays correctly
- [ ] Logs streaming works
- [ ] Media upload functional
- [ ] Deployment successful

---

**Platform Version**: 1.0.0  
**Last Updated**: 2026-03-25  
**Status**: ✅ Ready for Deployment
