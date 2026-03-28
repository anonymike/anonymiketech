# Resend Email Integration Setup Guide

## Overview
AnonymikeTech's email system is fully integrated with **Resend**, a powerful email delivery platform. All emails are sent from your domain (anonymiketech.online) with professional branding.

## Environment Setup

### 1. Add RESEND_API_KEY
The `RESEND_API_KEY` environment variable has already been configured in your Vercel project. This key is used to authenticate all email requests.

**Location:** Project Settings → Vars → RESEND_API_KEY

## Email Features

### Configured Email Types

#### 1. **Welcome Email** (`welcome`)
Sent to new users after registration
- **Data Required:** `email`, `name`
- **Example:**
  ```typescript
  import { emailUtils } from "@/lib/email-client"
  
  await emailUtils.sendWelcome("user@example.com", "John Doe")
  ```

#### 2. **VPS Order Confirmation** (`vps-order-confirmation`)
Sent immediately after VPS purchase
- **Data Required:** `email`, `name`, `orderId`, `planName`, `location`, `os`, `hostname`, `billingCycle`, `totalAmount`, `currency`
- **Example:**
  ```typescript
  import { emailUtils } from "@/lib/email-client"
  
  await emailUtils.sendVpsOrderConfirmation({
    email: "user@example.com",
    name: "John Doe",
    orderId: "VPS-20250329-001",
    planName: "Pro VPS",
    location: "US (Dallas)",
    os: "Ubuntu 22.04",
    hostname: "myserver.example.com",
    billingCycle: "12 Months",
    totalAmount: "499.99",
    currency: "$"
  })
  ```

#### 3. **VPS Provisioned** (`vps-provisioned`)
Sent when server is ready with credentials
- **Data Required:** `email`, `name`, `orderId`, `planName`, `ipAddress`, `hostname`, `rootPassword`, `sshPort`
- **Example:**
  ```typescript
  import { emailUtils } from "@/lib/email-client"
  
  await emailUtils.sendVpsProvisioned({
    email: "user@example.com",
    name: "John Doe",
    orderId: "VPS-20250329-001",
    planName: "Pro VPS",
    ipAddress: "192.168.1.100",
    hostname: "myserver.example.com",
    rootPassword: "SecurePassword123!",
    sshPort: 22
  })
  ```

#### 4. **Password Reset** (`password-reset`)
Sent for password recovery
- **Data Required:** `email`, `name`, `resetLink`
- **Example:**
  ```typescript
  import { emailUtils } from "@/lib/email-client"
  
  await emailUtils.sendPasswordReset(
    "user@example.com",
    "John Doe",
    "https://anonymiketech.online/reset?token=abc123"
  )
  ```

#### 5. **Contact Form** (`contact-form`)
Sends notification to support AND auto-reply to sender
- **Data Required:** `email`, `name`, `phone` (optional), `message`, `service` (optional)
- **Example:**
  ```typescript
  import { emailUtils } from "@/lib/email-client"
  
  await emailUtils.sendContactForm({
    email: "user@example.com",
    name: "John Doe",
    phone: "+971-50-123-4567",
    message: "I'm interested in your VPS hosting services.",
    service: "VPS Hosting"
  })
  ```

#### 6. **Newsletter Welcome** (`newsletter`)
Sent when user subscribes to newsletter
- **Data Required:** `email`
- **Example:**
  ```typescript
  import { emailUtils } from "@/lib/email-client"
  
  await emailUtils.sendNewsletterWelcome("user@example.com")
  ```

## API Endpoint

### POST /api/email/send

Send emails directly via the API endpoint:

```bash
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "type": "welcome",
    "data": {
      "email": "user@example.com",
      "name": "John Doe"
    }
  }'
```

**Request Schema:**
```typescript
{
  type: "welcome" | "vps-order-confirmation" | "vps-provisioned" | "password-reset" | "contact-form" | "newsletter",
  data: {
    // Fields depend on email type
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "id": "email-id-from-resend"
}
```

**Error Response (400/500):**
```json
{
  "error": "Error message describing what went wrong"
}
```

## Integration Examples

### In VPS Checkout Flow
```typescript
import { emailUtils } from "@/lib/email-client"

// After successful payment
async function handleVpsOrderComplete(orderData: OrderData) {
  try {
    // Send order confirmation email
    await emailUtils.sendVpsOrderConfirmation({
      email: orderData.customerEmail,
      name: orderData.customerName,
      orderId: orderData.orderId,
      planName: orderData.planName,
      location: orderData.location,
      os: orderData.operatingSystem,
      hostname: orderData.hostname || "Auto-generated",
      billingCycle: orderData.billingCycle,
      totalAmount: orderData.totalAmount,
      currency: orderData.currency
    })

    console.log("Order confirmation email sent")
  } catch (error) {
    console.error("Failed to send order email:", error)
    // Order is still successful, email is non-critical
  }
}
```

### In Contact Form
```typescript
import { emailUtils } from "@/lib/email-client"

async function handleContactSubmit(formData: ContactFormData) {
  try {
    await emailUtils.sendContactForm({
      email: formData.email,
      name: formData.name,
      phone: formData.phone,
      message: formData.message,
      service: formData.selectedService
    })
    
    return { success: true, message: "Your message has been sent!" }
  } catch (error) {
    console.error("Contact form error:", error)
    return { success: false, error: "Failed to send message" }
  }
}
```

## Email Customization

### Changing Email Templates
Edit `/lib/email-templates.ts` to customize:
- **Brand Color:** Change `BRAND_COLOR` variable
- **Brand Name:** Change `BRAND_NAME` variable
- **Email Content:** Modify individual template functions
- **Header/Footer:** Edit `baseTemplate()` function

### Changing From/Reply-To Address
Edit `/lib/resend.ts`:
```typescript
export const FROM_EMAIL = "AnonymikeTech <noreply@anonymiketech.online>"
export const SUPPORT_EMAIL = "support@anonymiketech.online"
```

## Verifying Email Domain

For emails to work properly with your domain (anonymiketech.online):

1. **Add DNS Records** (if not already done):
   - Go to Resend Dashboard → Domains
   - Add domain: `anonymiketech.online`
   - Follow Resend's DNS setup instructions
   - Update your DNS provider with the provided records

2. **Verify Domain:**
   - Resend will automatically verify once DNS records propagate
   - Can take 5-30 minutes for full propagation

3. **Check Status:**
   - Resend Dashboard → Domains → View your domain status
   - Should show "Verified" with green checkmark

## Testing Emails Locally

### Using Resend Console
```typescript
import { sendEmail } from "@/lib/resend"

// Test email function
async function testEmail() {
  const result = await sendEmail({
    to: "your-test-email@example.com",
    subject: "Test Email from AnonymikeTech",
    html: "<h1>This is a test email</h1>",
  })
  
  console.log(result)
}

// Run in your application
testEmail()
```

### Checking Delivery Status
Visit **Resend Dashboard → Messages** to:
- View all sent emails
- Check delivery status
- See bounce/complaint rates
- View email content

## Common Issues & Solutions

### Issue: Emails not received
**Solution:**
1. Check Resend API Key is set in environment variables
2. Verify domain is set up and verified in Resend Dashboard
3. Check spam/junk folders
4. Verify recipient email is correct
5. Check Resend dashboard for delivery failures

### Issue: Emails going to spam
**Solution:**
1. Ensure DMARC/SPF/DKIM are properly configured (handled by Resend)
2. Use clear, professional subject lines
3. Include unsubscribe option for marketing emails
4. Keep HTML simple and clean

### Issue: Rate limiting errors
**Solution:**
- Resend has generous rate limits (free tier: 100 emails/day)
- For higher volumes, upgrade Resend plan
- Implement exponential backoff retry logic

## Monitoring & Logs

### View Email Activity
1. Resend Dashboard → Messages
2. Filter by date, recipient, or type
3. Click email to view full content

### Server Logs
Check console for email-related logs:
```
[Resend] Email sent successfully: <email-id>
[Email] Sent successfully: <email-id>
[Resend] Error sending email: <error-message>
```

## Next Steps

1. **Verify your domain** in Resend Dashboard for production emails
2. **Test all email types** with sample data
3. **Integrate emails** into your checkout and contact form flows
4. **Monitor delivery** via Resend Dashboard
5. **Customize templates** to match your branding

## Support

For issues with Resend:
- **Resend Docs:** https://resend.com/docs
- **Resend Support:** https://resend.com/support
- **API Reference:** https://resend.com/docs/api-reference

For issues with AnonymikeTech integration:
- Check logs in `/lib/resend.ts` and `/app/api/email/send/route.ts`
- Verify RESEND_API_KEY is set correctly
- Test with simple email template first
