# Environment Variables Setup for VPS System

## Required Variables

Add these to your Vercel project environment variables:

```
STRIPE_SECRET_KEY=sk_live_your_actual_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
RESEND_API_KEY=re_your_resend_api_key_here
NEXT_PUBLIC_URL=https://yourdomain.com
```

## How to Get Each Key

### 1. STRIPE_SECRET_KEY

**Steps:**
1. Go to https://dashboard.stripe.com
2. Log in or create account
3. Click **Developers** (bottom left)
4. Click **API Keys**
5. Under "Secret key", click **Reveal test key** (or **Reveal live key** for production)
6. Copy the key that starts with `sk_test_` or `sk_live_`

**Example:**
```
sk_test_51HxxxxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 2. STRIPE_WEBHOOK_SECRET

**Steps:**
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to send:
   - Check `checkout.session.completed`
   - Leave others unchecked for now
5. Click **Add endpoint**
6. Click the endpoint you just created
7. Scroll down to "Signing secret"
8. Click **Reveal** to copy

**Example:**
```
whsec_test_1234567890abcdefghijklmnopqrstuvwxyz
```

### 3. RESEND_API_KEY

**Steps:**
1. Go to https://resend.com
2. Log in or create account
3. Go to **API Keys** (or https://resend.com/api-keys)
4. Click **Create API Key** or **New API Key**
5. Give it a name like "VPS Orders"
6. Copy the API key that starts with `re_`

**Example:**
```
re_abcdef1234567890ABCDEFGH1234567890
```

### 4. NEXT_PUBLIC_URL

This is your website's production URL:

**Development:**
```
http://localhost:3000
```

**Production:**
```
https://anonymiketech.com
```

Or whatever your actual domain is.

## Adding to Vercel

### Via Vercel Dashboard

1. Go to https://vercel.com
2. Click on your project
3. Go to **Settings**
4. Click **Environment Variables**
5. Add each variable:
   - Name: `STRIPE_SECRET_KEY`
   - Value: `sk_test_...`
   - Save
6. Repeat for other variables
7. Redeploy your project

### Via Vercel CLI

```bash
vercel env add STRIPE_SECRET_KEY
# Enter: sk_test_...

vercel env add STRIPE_WEBHOOK_SECRET
# Enter: whsec_...

vercel env add RESEND_API_KEY
# Enter: re_...

vercel env add NEXT_PUBLIC_URL
# Enter: https://yourdomain.com
```

## Testing Configuration

### Step 1: Verify Keys are Set

Check Vercel logs after deploying:
```
✓ Deployment successful
```

Go to your site and check browser console for any missing env var errors.

### Step 2: Test Stripe Payment

Use Stripe test card:
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- Cardholder Name: Any name

1. Go to `/vps`
2. Select a plan
3. Click "Get It Now"
4. Complete checkout with test card
5. Check emails (may go to spam)

### Step 3: Verify Webhook

1. Go to Stripe Dashboard
2. Click **Developers** → **Webhooks**
3. Click your endpoint
4. Under "Recent deliveries", you should see:
   - ✅ `checkout.session.completed` with 200 status

### Step 4: Check Emails

1. Check your email inbox for:
   - Customer email: Order confirmation with invoice
   - Resend logs: All delivery attempts shown

## Troubleshooting

### "Environment variables are not defined"

**Problem**: Page shows error about missing env vars
**Solution**: 
1. Verify all 4 variables are added in Vercel
2. Redeploy the project: `vercel deploy --prod`
3. Hard refresh browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### "Invalid Stripe API Key"

**Problem**: Payment fails with Stripe error
**Solution**:
1. Verify `STRIPE_SECRET_KEY` starts with `sk_` (not `pk_`)
2. Verify it's not expired or revoked in Stripe Dashboard
3. For production, use `sk_live_` not `sk_test_`

### "Webhook signature verification failed"

**Problem**: Webhook doesn't trigger
**Solution**:
1. Verify `STRIPE_WEBHOOK_SECRET` starts with `whsec_`
2. Verify webhook endpoint URL exactly matches: `https://yourdomain.com/api/webhooks/stripe`
3. Check Stripe Dashboard "Recent deliveries" tab for error details

### "Email not sending"

**Problem**: No email received after payment
**Solution**:
1. Verify `RESEND_API_KEY` is correct
2. Check Resend Dashboard → Logs for delivery attempts
3. Check spam folder
4. Verify email domain is verified in Resend
5. Check email address is correct in webhook

## Key Best Practices

✅ **DO:**
- Keep secret keys confidential
- Never commit keys to GitHub
- Use Vercel's environment variable manager
- Regenerate keys if compromised
- Use test keys for development

❌ **DON'T:**
- Share keys in chat or emails
- Commit keys in code
- Use same keys across projects
- Expose public keys as secret
- Use expired keys

## Key Rotation

### When to Rotate Keys

- Monthly for enhanced security
- If key is exposed
- If employee leaves
- If key is suspected compromised

### How to Rotate

1. **Create new key** in service dashboard
2. **Add to Vercel** as new environment variable
3. **Test thoroughly** with new key
4. **Update code** if multiple keys are used
5. **Delete old key** from service
6. **Remove from Vercel** old variable

## Using Different Keys per Environment

### Stripe Test vs Live

Stripe gives you two sets of keys:

**Test Mode** (Development):
- Key: `sk_test_...`
- Used for testing payments
- No real charges

**Live Mode** (Production):
- Key: `sk_live_...`
- Used for real payments
- Real charges applied

**Setup:**
1. Add both to Vercel as:
   - `STRIPE_TEST_KEY`
   - `STRIPE_LIVE_KEY`
2. Use logic in code to select:
   ```typescript
   const stripeKey = process.env.NODE_ENV === 'production' 
     ? process.env.STRIPE_LIVE_KEY 
     : process.env.STRIPE_TEST_KEY
   ```

## Verification Checklist

- [ ] STRIPE_SECRET_KEY is set and starts with `sk_`
- [ ] STRIPE_WEBHOOK_SECRET is set and starts with `whsec_`
- [ ] RESEND_API_KEY is set and starts with `re_`
- [ ] NEXT_PUBLIC_URL is set to your domain
- [ ] All variables are in Vercel Environment Variables
- [ ] Project has been redeployed after adding variables
- [ ] Browser cache cleared (hard refresh)
- [ ] Test payment completes successfully
- [ ] Webhook triggers successfully
- [ ] Email is received by customer
- [ ] Email is received by anonymiketech@gmail.com

## Support Resources

- **Stripe**: https://stripe.com/docs
- **Stripe API Keys**: https://dashboard.stripe.com/apikeys
- **Stripe Webhooks**: https://dashboard.stripe.com/webhooks
- **Resend**: https://resend.com/docs
- **Resend API Keys**: https://resend.com/api-keys
- **Vercel Env Vars**: https://vercel.com/docs/projects/environment-variables

---

**Last Updated**: March 28, 2026
