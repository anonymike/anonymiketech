# VPS System - Quick Reference Card

## 🚀 Quick Start (5 Minutes)

### 1. Add Environment Variables
Go to Vercel → Project Settings → Environment Variables → Add:

```
STRIPE_SECRET_KEY = sk_test_...
STRIPE_WEBHOOK_SECRET = whsec_...
RESEND_API_KEY = re_...
NEXT_PUBLIC_URL = https://yourdomain.com
```

### 2. Redeploy
```bash
vercel deploy --prod
```

### 3. Test
- Visit: `https://yourdomain.com/vps`
- Select plan → Complete checkout with `4242 4242 4242 4242`
- Check success page
- Check email inbox

## 📍 URLs

| Page | URL | Purpose |
|------|-----|---------|
| Pricing | `/vps` | Browse VPS plans & pricing |
| Checkout | `/vps/checkout` | Multi-step order form |
| Success | `/vps/success` | Order confirmation |
| Cancel | `/vps/cancel` | Payment cancelled |
| Webhook | `/api/webhooks/stripe` | Payment notifications |

## 💰 Pricing Structure

All prices have **$2 margin** added automatically.

**Base Prices:**
- S: $7.50 → $9.50/month
- M: $11.40 → $13.40/month
- L: $19.60 → $21.60/month
- XL: $36.00 → $38.00/month

**Billing Discounts:**
- 1 Month: 0%
- 3 Months: 20%
- 6 Months: 10%
- 12 Months: 15%

**Currency:** 1 USD = 135 KSH

## 🎟️ Promo Codes

| Code | Discount | Example |
|------|----------|---------|
| welcome20 | 20% | $13.40 → $10.72/month |
| anonymiketech10 | 10% | $13.40 → $12.06/month |

**Add More:**
Edit `/app/vps/checkout/page.tsx` line ~240

## 📧 Emails

**Customer Email**
- When: After successful payment
- From: orders@anonymiketech.com
- Content: Invoice + order details + next steps

**Business Email**
- When: After successful payment
- To: anonymiketech@gmail.com
- Content: Customer info + order details

## 🔑 API Keys Reference

| Key | Where | Example |
|-----|-------|---------|
| STRIPE_SECRET_KEY | Stripe Dashboard → Developers → API Keys | `sk_test_51Hxxx...` |
| STRIPE_WEBHOOK_SECRET | Stripe Dashboard → Webhooks → (click webhook) | `whsec_test_1234...` |
| RESEND_API_KEY | Resend Dashboard → API Keys | `re_abc123...` |
| NEXT_PUBLIC_URL | Your domain | `https://anonymiketech.com` |

## 🧪 Test Card

Use in checkout when testing:

```
Card: 4242 4242 4242 4242
Expiry: 12/25 (any future date)
CVC: 123 (any 3 digits)
```

**Result:** ✅ Payment succeeds, webhook triggers, emails sent

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Stripe errors | Check STRIPE_SECRET_KEY is set |
| Email not sending | Check RESEND_API_KEY, verify domain in Resend |
| Webhook not triggering | Verify webhook URL: `https://yourdomain.com/api/webhooks/stripe` |
| Prices incorrect | Verify $2 margin added in checkout, check exchange rate |
| Form validation fails | Check all fields filled correctly |

## 📝 File Locations

**Core Pages:**
- `/app/vps/page.tsx` - Pricing page
- `/app/vps/checkout/page.tsx` - Checkout flow
- `/app/vps/success/page.tsx` - Success page
- `/app/vps/cancel/page.tsx` - Cancel page

**API Routes:**
- `/app/api/vps/create-checkout-session/route.ts` - Create Stripe session
- `/app/api/vps/checkout/[sessionId]/route.ts` - Redirect to Stripe
- `/app/api/webhooks/stripe/route.ts` - Handle payments & send emails

**Configuration:**
- `/components/DesktopNavbar.tsx` - VPS navbar link

## 🔄 Workflow

```
1. User visits /vps
   ↓
2. Selects plan & currency
   ↓
3. Clicks "Get It Now"
   ↓
4. Completes 5-step checkout
   ↓
5. Enters payment details
   ↓
6. Stripe processes payment
   ↓
7. Webhook receives notification
   ↓
8. Emails sent to customer & business
   ↓
9. Success page displayed
```

## 🎯 Key Features

✅ 4 VPS tiers with specs  
✅ USD/KSH currency toggle  
✅ 5-step checkout wizard  
✅ Location selection (5 datacenters)  
✅ OS selection (5 options)  
✅ Promo code support  
✅ Stripe payment processing  
✅ Webhook automation  
✅ Automated invoicing  
✅ Email notifications  
✅ Mobile responsive  
✅ Progress indicators  

## 📋 Configuration Files

### Edit Pricing
**File:** `/app/vps/page.tsx` (lines 18-79)
```typescript
const VPS_PLANS: VPSPlan[] = [
  // Edit plan names, prices, specs, features
]
```

### Edit Promo Codes
**File:** `/app/vps/checkout/page.tsx` (line ~240)
```typescript
const handleApplyPromo = () => {
  // Add new promo codes here
}
```

### Edit Business Email
**File:** `/app/api/webhooks/stripe/route.ts` (line ~165)
```typescript
await resend.emails.send({
  from: "orders@anonymiketech.com",  // Change this
  to: "anonymiketech@gmail.com",     // And/or this
  // ...
})
```

### Edit Currency Rate
**File:** `/app/vps/page.tsx` (line 61)
```typescript
const exchangeRate = 135  // Change rate here
```

## 🚨 Important Notes

⚠️ **Do NOT:**
- Commit API keys to Git
- Share secret keys
- Use test keys in production
- Delete old API keys immediately (keep for rollback)

✅ **Always:**
- Verify all env vars are set
- Test payments before going live
- Monitor webhook deliveries
- Check email logs regularly
- Keep backup of API keys

## 🆘 Need Help?

**Documentation Files:**
- `VPS_SETUP_GUIDE.md` - Complete setup instructions
- `VPS_IMPLEMENTATION_SUMMARY.md` - What was built
- `ENV_VARIABLES_SETUP.md` - Detailed env var setup
- `VPS_TESTING_GUIDE.md` - How to test everything

**External Help:**
- Stripe Support: https://stripe.com/support
- Resend Docs: https://resend.com/docs
- Vercel Docs: https://vercel.com/docs

## ✅ Pre-Launch Checklist

- [ ] All env vars added to Vercel
- [ ] Project redeployed after adding vars
- [ ] Test payment completes successfully
- [ ] Customer email received with invoice
- [ ] Business email received with order
- [ ] Webhook shows successful delivery in Stripe
- [ ] Success page displays correctly
- [ ] VPS link appears in navbar
- [ ] Mobile responsive tested
- [ ] Live API keys configured (when ready)

---

**Version:** 1.0  
**Last Updated:** March 28, 2026

**Status:** ✅ Ready to Deploy
