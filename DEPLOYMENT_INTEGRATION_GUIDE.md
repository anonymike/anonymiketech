# Deployment Integration Guide

## Overview

This guide explains how to integrate the new QR authentication and session validation components into your WhatsApp Bot Dashboard. The platform now supports:

1. **Session ID Validation** - Users can validate existing TRUTH-MD session IDs
2. **QR Code Authentication** - Secure WhatsApp account linking via QR code
3. **Step-by-Step Bot Deployment** - Guided three-step process for deploying new bots

---

## Component Architecture

### 1. WhatsAppBotCreationForm (Enhanced)

**Location:** `components/WhatsAppBotCreationForm.tsx`

**What's New:**
- Session ID validation section below the "No WhatsApp accounts linked" alert
- Users can paste and validate existing TRUTH-MD session IDs before linking
- Optional validation workflow that doesn't block the main form

**Usage:**
```tsx
<WhatsAppBotCreationForm
  template={selectedTemplate}
  onSuccess={(botId) => console.log('Bot created:', botId)}
  onBack={() => goBack()}
  token={userToken}
/>
```

**Key Features:**
- Validates session IDs for format and correctness
- Encrypts session data before storage
- Shows validation status with visual feedback
- Falls back to standard QR authentication if validation fails

---

### 2. WhatsAppBotTemplateSelector (Enhanced)

**Location:** `components/WhatsAppBotTemplateSelector.tsx`

**What's New:**
- New "Quick Start: QR Code Authentication" section at the top
- Educational banner explaining the authentication flow
- Direct button to start QR authentication
- Better visual hierarchy with "Select Your Bot Type" heading

**Usage:**
```tsx
<WhatsAppBotTemplateSelector
  onSelect={(template) => handleTemplateSelect(template)}
  isLoading={false}
/>
```

**Integration Points:**
- Fetches available templates from `/api/chatbots/whatsapp/templates`
- Displays template features and descriptions
- Triggers creation flow when template is selected

---

### 3. DeployNewBotSection (NEW)

**Location:** `components/DeployNewBotSection.tsx`

**What It Does:**
This is the main entry point for the "Deploy New Bot" dashboard section. It orchestrates a three-step process:

1. **Template Selection** - Choose from available bot templates
2. **QR Authentication** - Authenticate WhatsApp account via QR code
3. **Configuration Complete** - Review and confirm bot deployment

**Usage:**
```tsx
<DeployNewBotSection
  token={userToken}
  onBotCreated={(botId) => handleBotCreated(botId)}
/>
```

**Props:**
- `token`: User authentication token for API calls
- `onBotCreated`: Callback when bot is successfully created

**Features:**
- Visual step indicator showing progress
- Smooth transitions between steps
- Clear information display at each stage
- Back/Reset functionality
- Phone number confirmation display

---

### 4. WhatsAppQRAuth (Existing Enhancement)

**Location:** `components/WhatsAppQRAuth.tsx`

**What Changed:**
- Better integration with the deployment flow
- Success callback includes phone number
- Improved error handling and display
- Real-time QR code updates

**Usage:**
```tsx
<WhatsAppQRAuth
  botTemplate={template}
  onSuccess={(phoneNumber) => handleSuccess(phoneNumber)}
  token={userToken}
/>
```

**API Integration:**
- Connects to `/api/chatbots/whatsapp/auth/qr`
- Generates QR codes via Baileys library
- Polls session status until authenticated
- Returns phone number on success

---

## Integration Steps

### Step 1: Add to Dashboard Page

In your dashboard page component (e.g., `app/chatbots-ai/dashboard/page.tsx`):

```tsx
import DeployNewBotSection from '@/components/DeployNewBotSection'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Other dashboard sections */}
      
      <DeployNewBotSection
        token={userToken}
        onBotCreated={handleBotCreated}
      />
    </div>
  )
}
```

### Step 2: Add Session Validation Endpoint (Optional)

Create an API route for validating session IDs:

```typescript
// app/api/chatbots/whatsapp/sessions/validate/route.ts

export async function POST(request: Request) {
  const { sessionId } = await request.json()
  
  try {
    // Validate session format
    if (!sessionId.startsWith('TRUTH-MD:~')) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid session format' }),
        { status: 400 }
      )
    }
    
    // Check session with database
    const isValid = await validateSessionWithDB(sessionId)
    
    return new Response(
      JSON.stringify({ 
        valid: isValid,
        phoneNumber: isValid ? extractPhoneFromSession(sessionId) : null 
      })
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ valid: false, error: error.message }),
      { status: 500 }
    )
  }
}
```

### Step 3: Wire Up Callbacks

Handle the deployment flow callbacks:

```tsx
const handleBotCreated = async (botId: string) => {
  try {
    // Redirect to bot configuration
    router.push(`/chatbots-ai/details/${botId}`)
    
    // Show success toast
    toast.success('Bot deployed successfully!')
  } catch (error) {
    toast.error('Failed to deploy bot')
  }
}
```

---

## Database Tables Required

The following tables should exist in Supabase:

```sql
-- Templates
CREATE TABLE whatsapp_bot_templates (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  icon VARCHAR,
  features JSONB,
  category VARCHAR,
  repository_url VARCHAR
);

-- Credentials (from QR auth)
CREATE TABLE whatsapp_credentials (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  phone_number VARCHAR UNIQUE,
  session_data JSONB ENCRYPTED,
  status VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth.users
);

-- Bot Instances
CREATE TABLE whatsapp_bots (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  template_id UUID,
  credential_id UUID,
  name VARCHAR NOT NULL,
  status VARCHAR,
  deployed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth.users,
  FOREIGN KEY (template_id) REFERENCES whatsapp_bot_templates,
  FOREIGN KEY (credential_id) REFERENCES whatsapp_credentials
);
```

---

## Session ID Validation Workflow

When a user has an existing TRUTH-MD session ID:

1. User navigates to "Create WhatsApp Bot"
2. Sees "No WhatsApp accounts linked" alert
3. Below alert is "Validate Session ID (Optional)" section
4. User pastes their `TRUTH-MD:~` session ID
5. Clicks "Validate Session"
6. System:
   - Validates format
   - Decrypts and checks with database
   - Extracts phone number
   - Shows success/error message
7. If valid, credential is auto-linked
8. User can proceed with bot creation

---

## QR Code Authentication Workflow

1. User selects a bot template
2. Automatically taken to QR auth step
3. System generates QR code via Baileys
4. User scans with WhatsApp app
5. Connection established
6. Phone number extracted and displayed
7. User confirms configuration
8. Proceeds to create bot instance

---

## Error Handling

Each component has built-in error handling:

| Error | Handling |
|-------|----------|
| Invalid session format | Show alert, suggest QR auth |
| QR code generation failed | Retry button, fallback pairing code |
| Session authentication timeout | Timeout message, manual code entry |
| Database connection error | Retry with exponential backoff |

---

## API Endpoints Required

### QR Authentication
- **POST** `/api/chatbots/whatsapp/auth/qr` - Generate QR code
- **GET** `/api/chatbots/whatsapp/auth/qr?botId=` - Poll status
- **POST** `/api/chatbots/whatsapp/auth/pair` - Generate pairing code

### Session Management
- **POST** `/api/chatbots/whatsapp/sessions/validate` - Validate session ID
- **GET** `/api/chatbots/whatsapp/credentials` - List user's credentials
- **POST** `/api/chatbots/whatsapp/credentials` - Store new credential

### Bot Management
- **POST** `/api/chatbots/whatsapp/bots` - Create bot instance
- **GET** `/api/chatbots/whatsapp/bots` - List user's bots
- **POST** `/api/chatbots/whatsapp/bots/[id]/deploy` - Deploy bot

---

## Styling & Theming

All components use Tailwind CSS with your existing design tokens:

- Primary color for CTAs and active states
- Muted colors for inactive/secondary elements
- Border colors for section separation
- Responsive grid layouts (md: breakpoint)

To customize colors, update `globals.css` design tokens.

---

## Testing Checklist

- [ ] Template selector loads and displays templates
- [ ] QR code generates and updates in real-time
- [ ] Session ID validation shows feedback
- [ ] Step indicators progress correctly
- [ ] Back buttons navigate properly
- [ ] Phone number displays after auth
- [ ] Success callback fires with bot ID
- [ ] Error states show appropriate messages
- [ ] Mobile responsiveness works
- [ ] Dark mode styling is correct

---

## Troubleshooting

**QR Code Not Loading:**
- Check Baileys library version
- Verify WebSocket connections are allowed
- Check browser console for CORS errors

**Session Validation Fails:**
- Ensure session format: `TRUTH-MD:~[base64]`
- Check encryption key is set in environment
- Verify database connection

**Authentication Times Out:**
- User may not have scanned QR
- Session may have expired (15-20 min)
- Suggest manual pairing code instead

---

## Future Enhancements

- [ ] Support for multiple WhatsApp profiles per user
- [ ] Session import from TRUTH-MD backup files
- [ ] Batch bot deployment
- [ ] Session expiration handling
- [ ] Device management dashboard
- [ ] Analytics integration
