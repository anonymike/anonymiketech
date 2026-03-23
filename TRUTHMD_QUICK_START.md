# TRUTH MD Session Import - Quick Start

## For Users: Getting Started in 5 Minutes

### Step 1: Create Your Bot
1. Go to Dashboard → Create New Bot
2. Select a template
3. Fill in bot name and phone
4. Click "Create Bot"

### Step 2: Choose TRUTH MD Tab
1. Click on "Deploy Your Bot" panel
2. Select "TRUTH MD Session" tab (not "Standard Deployment")

### Step 3: Get Session from TRUTH MD
1. Click the link or visit: https://truth-md.courtneytech.xyz/
2. Click "Pair WhatsApp"
3. Scan QR code with your phone
4. Wait for "Pairing Complete"
5. **Copy the entire session** (starts with `TRUTH-MD:~`)

### Step 4: Paste & Deploy
1. Return to Dashboard
2. Paste session in the big text box
3. Click "Import & Deploy"
4. Wait 10 seconds
5. Page reloads → Bot is deployed! ✅

## What You'll See

### Success ✅
```
✓ Session Imported Successfully!
Your TRUTH MD session has been saved and your bot is being deployed now.
Deploying bot... This may take a few moments.
```

### Error ❌
```
Invalid Session
The session format you provided is invalid. Make sure you copied the 
entire TRUTH-MD:~ string from TRUTH MD.
```

**Solution**: Go back to TRUTH MD, copy again, make sure it starts with `TRUTH-MD:~`

## Common Questions

**Q: Where do I get the session?**
A: Visit https://truth-md.courtneytech.xyz/ and complete WhatsApp pairing

**Q: What if I see an error?**
A: Read the error message - it explains the problem. Usually means:
- Wrong format (doesn't start with TRUTH-MD:~)
- Not fully copied
- Network issue (try again)

**Q: How long does deployment take?**
A: About 10 seconds total. You'll see a progress message.

**Q: Can I use standard deployment instead?**
A: Yes! Click the "Standard Deployment" tab for the other method.

**Q: What if the session expires?**
A: Get a fresh one from TRUTH MD and import again.

---

## For Developers: Setup in 2 Steps

### Step 1: Run Migration
```bash
# Open Supabase SQL editor and run:
scripts/add-truthmd-sessions.sql
```

### Step 2: Deploy Code
Push these files to production:
- `components/TruthMdSessionImporter.tsx` (NEW)
- `app/api/chatbots/whatsapp/bots/[id]/session/route.ts` (NEW)
- `components/WhatsAppBotDeploymentPanel.tsx` (UPDATED)
- `scripts/add-truthmd-sessions.sql` (MIGRATION)

That's it! 🚀

## API Quick Reference

### Import Session
```bash
curl -X POST /api/chatbots/whatsapp/bots/BOT_ID/session \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "session_string": "TRUTH-MD:~eyJub2lz...",
    "source": "truth_md"
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "botId": "uuid",
    "sessionId": "uuid",
    "status": "session_stored",
    "message": "Session imported successfully..."
  }
}
```

### Get Session Info
```bash
curl /api/chatbots/whatsapp/bots/BOT_ID/session \
  -H "Authorization: Bearer TOKEN"
```

### Delete Session
```bash
curl -X DELETE /api/chatbots/whatsapp/bots/BOT_ID/session \
  -H "Authorization: Bearer TOKEN"
```

## File Locations

| File | Purpose |
|------|---------|
| `components/TruthMdSessionImporter.tsx` | Session import form |
| `components/WhatsAppBotDeploymentPanel.tsx` | Main deployment panel (with tabs) |
| `app/api/chatbots/whatsapp/bots/[id]/session/route.ts` | API endpoints |
| `scripts/add-truthmd-sessions.sql` | Database migration |
| `TRUTHMD_INTEGRATION_GUIDE.md` | Full documentation |
| `TRUTHMD_IMPLEMENTATION_SUMMARY.md` | Technical summary |

## Testing Checklist

- [ ] Session import works with valid TRUTH-MD:~ string
- [ ] Error shown for invalid format
- [ ] Bot deploys automatically
- [ ] Can switch between tabs
- [ ] Mobile view responsive
- [ ] Can delete session
- [ ] User can't access other user's sessions
- [ ] Activity logged in database

## Troubleshooting

### "Invalid Session Format"
- Copy the ENTIRE session from TRUTH MD
- Make sure it starts with `TRUTH-MD:~`
- Don't add spaces before/after
- Try pasting in a text editor first to verify

### "Failed to Create Pairing Session"
- Check internet connection
- Try refreshing page
- Try again in a minute
- Contact support if persists

### "Database Error"
- Verify migration ran successfully
- Check Supabase status
- Verify auth tables exist
- Contact support with bot ID

### Bot Shows "Configuring" but Doesn't Deploy
- Wait 30 seconds
- Refresh the page
- Check browser console for errors
- Try importing session again

## Performance

| Step | Time |
|------|------|
| Validate format | < 100ms |
| Store in database | < 1s |
| Auto-deploy | < 5s |
| **Total** | **< 10s** |

## Security Features

- Session stored encrypted in database
- User ownership verified on every operation
- Row-level security policies enforced
- All operations logged for audit trail
- Error messages don't leak sensitive info

## Support Links

- **TRUTH MD Issues**: https://truth-md.courtneytech.xyz/
- **Dashboard Support**: Contact support team
- **Full Docs**: `TRUTHMD_INTEGRATION_GUIDE.md`
- **Technical Info**: `TRUTHMD_IMPLEMENTATION_SUMMARY.md`

---

## Quick Recap

```
Create Bot → Choose TRUTH MD → Get Session → Paste → Deploy ✅
```

That's all! Your bot is now live with your TRUTH MD session.

Happy bot building! 🎉
