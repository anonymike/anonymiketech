# ANONYMIKETECH VPS Sales System - Setup Guide

## Overview
A complete VPS sales system with pricing, checkout flow, payment processing via Stripe, and automated email notifications via Resend.

## Features Implemented
✅ **Pricing Page** (`/vps`)
- 4 VPS tiers: S (Starter), M (Professional), L (Business), XL (Enterprise)
- Currency toggle: USD ↔ KSH (1 USD = 135 KSH)
- Automatic $2 margin on each plan
- Feature comparison with plan specs

✅ **Multi-Step Checkout** (`/vps/checkout`)
- Step 1: Location selection (US, Germany, South Africa, UAE, Singapore)
- Step 2: Billing cycle (1/3/6/12 months with automatic discounts)
- Step 3: Operating system selection (Ubuntu, Debian, AlmaLinux, Arch, Windows)
- Step 4: Server configuration (Hostname, SSH public key)
- Step 5: Payment review with promo code support

✅ **Payment Processing**
- Stripe integration for secure payments
- Support for multiple currencies (USD/KSH)
- Promo code validation (examples: `welcome20`, `anonymiketech10`)
- Real-time price calculation

✅ **Order Management & Emails**
- Automatic invoice generation in HTML format
- Email sent to customer with order confirmation
- Email sent to business (anonymiketech@gmail.com) with order details
- Order metadata stored with Stripe session

✅ **User Experience**
- Success page with order confirmation
- Cancel page with retry option
- Progress indicator for checkout steps
- Responsive design for all devices

## Environment Variables Required

Add these to your Vercel project environment variables:

```
STRIPE_SECRET_KEY=sk_live_... (or sk_test_... for testing)
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
NEXT_PUBLIC_URL=https://yourdomain.com
```

## Setup Instructions

### 1. Stripe Configuration

#### a. Get Your Keys
1. Go to [stripe.com](https://stripe.com)
2. Log in or create account
3. Navigate to **Developers** → **API Keys**
4. Copy both:
   - Secret Key (starts with `sk_live_` or `sk_test_`)
   - Publishable Key (save for later if needed)

#### b. Set Up Webhook
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. URL: `https://yourdomain.com/api/webhooks/stripe`
4. Events to send: Select `checkout.session.completed`
5. Copy the **Signing secret** (starts with `whsec_`)

#### c. Configure Success/Cancel URLs
- Success: `https://yourdomain.com/vps/success`
- Cancel: `https://yourdomain.com/vps/cancel`

### 2. Resend Configuration

#### a. Get Your API Key
1. Go to [resend.com](https://resend.com)
2. Sign up or log in
3. Navigate to **API Keys**
4. Create a new key and copy it

#### b. Configure Email Domain
1. In Resend, go to **Domains**
2. Add your domain or verify the default domain
3. Update email sending address in code if needed:
   - Currently: `from: "orders@anonymiketech.com"`
   - Change to your verified Resend domain

### 3. Add Environment Variables to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add:
   ```
   STRIPE_SECRET_KEY = [your stripe secret key]
   STRIPE_WEBHOOK_SECRET = [your webhook secret]
   RESEND_API_KEY = [your resend api key]
   NEXT_PUBLIC_URL = [your production url]
   ```

### 4. Update Domain Email (Optional)

If you want emails from a custom domain:

**File: `/app/api/webhooks/stripe/route.ts`**
```typescript
// Line ~165
await resend.emails.send({
  from: "orders@yourdomain.com",  // ← Change this
  to: customerEmail,
  // ...
})
```

## Promo Code Configuration

Default promo codes:
- `welcome20`: 20% discount
- `anonymiketech10`: 10% discount

### Add More Codes

**File: `/app/vps/checkout/page.tsx`**
```typescript
// Around line 240
const handleApplyPromo = () => {
  if (promoCode.toLowerCase() === "welcome20") {
    setAppliedPromo({ code: promoCode, discount: 0.2 })
  } else if (promoCode.toLowerCase() === "anonymiketech10") {
    setAppliedPromo({ code: promoCode, discount: 0.1 })
  } else if (promoCode.toLowerCase() === "newyear25") {  // ← Add new
    setAppliedPromo({ code: promoCode, discount: 0.25 })
  } else {
    setErrors({ promoCode: "Invalid promo code" })
  }
}
```

## Pricing Structure

All base prices have $2 margin added automatically:

| Plan | Tier | Base Price | With Margin | Specs |
|------|------|-----------|-------------|-------|
| S | Starter | $7.50 | $9.50 | 3 CPU, 6GB RAM, 50GB NVMe |
| M | Professional | $11.40 | $13.40 | 6 CPU, 16GB RAM, 100GB NVMe ⭐ |
| L | Business | $19.60 | $21.60 | 8 CPU, 32GB RAM, 200GB NVMe |
| XL | Enterprise | $36.00 | $38.00 | 12 CPU, 64GB RAM, 400GB NVMe |

**KSH Conversion:** Multiply by 135 (1 USD = 135 KSH)

## Billing Cycle Discounts

- 1 Month: No discount
- 3 Months: 20% discount (SAVE 20%)
- 6 Months: 10% discount (SAVE 10%)
- 12 Months: 15% discount (SAVE 15%)

## File Structure

```
app/
├── vps/
│   ├── page.tsx                 # Pricing page
│   ├── checkout/
│   │   └── page.tsx            # Multi-step checkout
│   ├── success/
│   │   └── page.tsx            # Order success page
│   └── cancel/
│       └── page.tsx            # Order cancel page
└── api/
    ├── vps/
    │   ├── create-checkout-session/
    │   │   └── route.ts         # Create Stripe session
    │   └── checkout/
    │       └── [sessionId]/
    │           └── route.ts     # Redirect to Stripe
    └── webhooks/
        └── stripe/
            └── route.ts         # Handle Stripe events & send emails
```

## Testing

### Test Mode (Recommended First)

Use Stripe test keys instead of live keys:
- Test Secret: `sk_test_...`
- Test Webhook Secret: `whsec_test_...`

Use test card: `4242 4242 4242 4242` (expiry: any future date, CVC: any 3 digits)

### Live Mode

When ready for production:
1. Switch to live Stripe keys
2. Set `NEXT_PUBLIC_URL` to your production domain
3. Ensure webhook is properly configured
4. Test with real payment method

## Email Customization

### Customize Invoice Template

**File: `/app/api/webhooks/stripe/route.ts`**
Modify the `generateInvoicePDF` function around line 50 to customize:
- Company name/branding
- Invoice styling
- Terms and conditions
- Support information

### Email Recipients

Currently emails are sent to:
- **Customer**: Email provided during checkout
- **Business**: `anonymiketech@gmail.com`

To change business email:
1. Update in `/app/api/webhooks/stripe/route.ts` around line 165
2. Or set a new environment variable

## Monitoring Orders

### View in Stripe Dashboard
1. Go to Stripe Dashboard
2. Navigate to **Payments**
3. All orders appear with metadata showing:
   - Plan selected
   - Location
   - OS chosen
   - Customer email

### Database Integration (Optional)

To permanently store orders, connect a database:
- **PostgreSQL** (Supabase, Neon, or AWS Aurora)
- Create `orders` table with:
  - id, customerId, planId, location, os, amount, currency, createdAt, etc.
- Insert order in webhook before sending emails

Example:
```typescript
// In /app/api/webhooks/stripe/route.ts, before sending emails
const order = await db.orders.create({
  data: {
    stripeSessionId: session.id,
    customerEmail: customerEmail,
    planId: metadata.planId,
    location: metadata.location,
    os: metadata.os,
    amount: amountPaid,
    currency: metadata.currency,
  }
})
```

## Troubleshooting

### Emails Not Sending
- Check Resend API key is correct
- Verify email domain is verified in Resend
- Check Vercel logs for error details

### Stripe Webhook Not Triggering
- Confirm webhook URL is exactly correct
- Check webhook signing secret matches
- Verify firewall/security allows Stripe IPs
- Check Vercel logs

### Pricing Incorrect
- Verify exchange rate is 135 in checkout page
- Check $2 margin is applied in API route
- Confirm billing cycle discounts are applied

## Support

For help with:
- **Stripe Issues**: Visit [stripe.com/support](https://stripe.com/support)
- **Resend Issues**: Visit [resend.com/support](https://resend.com/support)
- **Your Site**: Contact `anonymiketech@gmail.com`

## Next Steps

1. ✅ Implement database for order persistence
2. ✅ Add order history page for customers
3. ✅ Implement automatic server provisioning
4. ✅ Add email receipt with login credentials
5. ✅ Create admin panel for order management
6. ✅ Add additional payment methods (M-Pesa, PayPal, etc.)
7. ✅ Implement subscription billing instead of one-time payments
8. ✅ Add SSL certificate support
9. ✅ Create knowledge base/FAQ section
10. ✅ Add live chat support widget

---

**Last Updated:** March 28, 2026
**Version:** 1.0
