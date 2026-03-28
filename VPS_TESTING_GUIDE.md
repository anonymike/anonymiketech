# VPS System - Complete Testing Guide

## Pre-Testing Checklist

Before starting tests, verify:

- [ ] All environment variables are set in Vercel
- [ ] Project has been redeployed after adding env vars
- [ ] You have access to test email inbox
- [ ] Stripe webhook is configured
- [ ] Resend account is active

## Test Scenarios

### Scenario 1: Browse Pricing Page

**Objective**: Verify pricing page displays correctly with all features

**Steps**:
1. Go to `https://yourdomain.com/vps`
2. Verify page shows:
   - ✅ "ANONYMIKETECH VPS" title
   - ✅ 4 pricing cards (S, M, L, XL)
   - ✅ "BEST SELLER" badge on M plan
   - ✅ Currency toggle buttons (USD/KSH)
   - ✅ "Get It Now" buttons on each card
   - ✅ Features section with 6 feature cards

**Currency Toggle Test**:
1. Click USD button (should be selected)
2. Verify all prices show in format: `$ X.XX`
3. Click KSH button
4. Verify all prices changed to KSH (much larger numbers)
5. Verify format: `KSH XXXXX`
6. Click USD again to return

**Price Verification** (USD):
- S Plan: $9.50/month (base $7.50 + $2)
- M Plan: $13.40/month (base $11.40 + $2)
- L Plan: $21.60/month (base $19.60 + $2)
- XL Plan: $38.00/month (base $36 + $2)

**Price Verification** (KSH - multiply by 135):
- S Plan: 1,282 KSH
- M Plan: 1,809 KSH
- L Plan: 2,916 KSH
- XL Plan: 5,130 KSH

### Scenario 2: Select Plan and Start Checkout

**Objective**: Verify plan selection and checkout initialization

**Steps**:
1. On pricing page, click "Get It Now" on M plan
2. Should redirect to `/vps/checkout?plan=m-plan&currency=USD`
3. Verify checkout page shows:
   - ✅ Progress steps (1-5) displayed
   - ✅ Step 1 of 5 highlighted
   - ✅ Location selection page showing
   - ✅ Order summary panel on right
   - ✅ Plan name: "VPS M - Professional"
   - ✅ Monthly price in summary

**Expected Summary Values**:
```
Plan: VPS M - Professional
Monthly: $13.40
Months: × 1
Total: $13.40
```

### Scenario 3: Complete Step 1 - Location Selection

**Objective**: Verify location selection and step progression

**Steps**:
1. On checkout page, verify 5 locations shown:
   - ✅ 🇺🇸 US (Dallas)
   - ✅ 🇩🇪 Germany (Frankfurt)
   - ✅ 🇿🇦 South Africa (Johannesburg)
   - ✅ 🇦🇪 UAE (Dubai)
   - ✅ 🇸🇬 Singapore
2. Click on "Germany (Frankfurt)"
3. Verify it's selected (blue border)
4. Click "Next" button
5. Should advance to Step 2

### Scenario 4: Complete Step 2 - Billing Cycle

**Objective**: Verify billing cycle selection and pricing updates

**Steps**:
1. On Step 2, verify 4 billing options:
   - ✅ 1 Month (no discount)
   - ✅ 3 Months (SAVE 20%)
   - ✅ 6 Months (SAVE 10%)
   - ✅ 12 Months (SAVE 15%)
2. Click "3 Months"
3. Verify selected (blue border)
4. Check right panel updates:
   ```
   Monthly: $13.40
   Months: × 3
   Discount: -20%
   Total: $32.16
   ```
5. Click "6 Months"
6. Verify totals change to:
   ```
   Monthly: $13.40
   Months: × 6
   Discount: -10%
   Total: $72.36
   ```
7. Select "12 Months"
8. Verify totals change to:
   ```
   Monthly: $13.40
   Months: × 12
   Discount: -15%
   Total: $136.08
   ```
9. Select "1 Month" (revert)
10. Click "Next" to Step 3

### Scenario 5: Complete Step 3 - Operating System

**Objective**: Verify OS selection

**Steps**:
1. On Step 3, verify 5 OS options:
   - ✅ 🐧 Ubuntu 24.04
   - ✅ 🐦 Debian 12
   - ✅ 🔴 AlmaLinux 9
   - ✅ 🐘 Arch Linux (Latest)
   - ✅ 🪟 Windows Server 2022
2. Select "Ubuntu 24.04" (default)
3. Verify it's selected
4. Click "Next" to Step 4

### Scenario 6: Complete Step 4 - Configuration

**Objective**: Verify form validation and SSH key input

**Error Handling**:
1. Click "Next" without entering hostname
2. Verify error: "Hostname is required"
3. Enter invalid hostname: `invalid!@#`
4. Click "Next"
5. Verify error: "Invalid hostname format"
6. Enter valid hostname: `myserver.vm`
7. Verify error clears
8. Leave SSH key empty
9. Click "Next"
10. Verify error: "SSH public key is required"

**Valid Input**:
1. Enter hostname: `vm513voko.yourlocaldomain.com`
2. Enter SSH key (use test SSH key):
   ```
   ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDZeY6bVvb8Y7p... (any valid format)
   ```
3. Click "Next" to Step 5
4. Should show no errors

### Scenario 7: Step 5 - Payment Review & Promo

**Objective**: Verify order summary and promo code functionality

**Order Summary**:
1. Verify all details shown:
   - ✅ Plan: VPS M - Professional
   - ✅ Location: US (Dallas) [or selected location]
   - ✅ OS: Ubuntu 24.04
   - ✅ Hostname: vm513voko.yourlocaldomain.com
2. Verify total: $13.40 (1 month, no discount)

**Test Invalid Promo Code**:
1. Enter promo code: `invalid123`
2. Click "Apply"
3. Verify error message appears

**Test Valid Promo Code - welcome20**:
1. Clear promo input
2. Enter: `welcome20`
3. Click "Apply"
4. Verify promo is applied:
   - ✅ Shows "Promo applied: welcome20"
   - ✅ Summary shows discount line
   - ✅ Total is reduced by 20%
   - Expected total: $10.72 (13.40 × 0.8)
5. Click "Remove"
6. Verify promo is removed and total returns to $13.40

**Test Valid Promo Code - anonymiketech10**:
1. Enter: `anonymiketech10`
2. Click "Apply"
3. Verify applied with 10% discount
4. Expected total: $12.06 (13.40 × 0.9)

### Scenario 8: Complete Payment - Test Card

**Objective**: Verify Stripe payment processing

**Test Payment with Stripe Test Card**:
1. Click "Proceed to Payment"
2. Should redirect to Stripe hosted checkout
3. Verify Stripe page shows:
   - ✅ Plan name
   - ✅ Total amount
   - ✅ Payment method options
4. Enter test card details:
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25` (any future date)
   - CVC: `123` (any 3 digits)
   - Name: `Test Customer`
   - Email: Your test email address
5. Click "Pay"
6. Should see loading spinner
7. Should redirect to `/vps/success?session_id=cs_test_...`

### Scenario 9: Success Page Verification

**Objective**: Verify order confirmation page

**Success Page Should Show**:
1. ✅ Green checkmark icon with animation
2. ✅ "Order Confirmed! 🎉" message
3. ✅ "Your VPS is being set up" subtitle
4. ✅ Order ID (session ID) displayed
5. ✅ Copy button for Order ID
6. ✅ "What happens next?" section with 4 steps:
   - VPS ready in 10 minutes
   - Login credentials via email
   - Access control panel link
   - Support contact info
7. ✅ Buttons: "Access Control Panel" and "Back to VPS Plans"

**Test Order ID Copy**:
1. Click copy icon next to Order ID
2. Verify "Copied!" message appears
3. Should disappear after 2 seconds

### Scenario 10: Email Verification

**Objective**: Verify emails are sent to both customer and business

**Check Customer Email**:
1. Go to the test email address you used in checkout
2. Look for email with subject:
   ```
   VPS Order Confirmation - VPS M - Professional
   ```
3. Verify email contains:
   - ✅ Invoice header
   - ✅ Plan details
   - ✅ Location
   - ✅ OS selected
   - ✅ Pricing breakdown
   - ✅ "Next steps" instructions

**Check Business Email**:
1. Go to `anonymiketech@gmail.com` inbox
2. Look for email with subject:
   ```
   New VPS Order - your-test-email@example.com
   ```
3. Verify email contains:
   - ✅ Customer email
   - ✅ Plan ordered
   - ✅ Location
   - ✅ OS selected
   - ✅ Hostname
   - ✅ Amount paid
   - ✅ Order ID

**Troubleshooting Emails**:
- If no email: Check spam folder
- Still missing: Check Resend Dashboard logs
- No logs: Verify RESEND_API_KEY in Vercel
- Check Stripe webhook delivery in Stripe Dashboard

### Scenario 11: Test Payment Cancellation

**Objective**: Verify cancel page functionality

**Steps**:
1. Go back to `/vps`
2. Click "Get It Now" on S plan
3. Complete steps 1-4 (or just click through)
4. On Step 5 payment review, click browser back button
5. Or go directly to `/vps/cancel`
6. Verify cancel page shows:
   - ✅ Red X icon
   - ✅ "Payment Cancelled" message
   - ✅ "Order not completed" message
   - ✅ "Return to Plans" button
   - ✅ "Contact Support" button

### Scenario 12: Currency Conversion Accuracy

**Objective**: Verify KSH pricing calculations

**Test KSH Conversion** (1 USD = 135 KSH):

| Plan | USD Price | KSH Price (Expected) | Calculation |
|------|-----------|-------------------|-------------|
| S | $9.50 | 1,282 KSH | 9.50 × 135 = 1,282.5 ≈ 1,282 |
| M | $13.40 | 1,809 KSH | 13.40 × 135 = 1,809 |
| L | $21.60 | 2,916 KSH | 21.60 × 135 = 2,916 |
| XL | $38.00 | 5,130 KSH | 38.00 × 135 = 5,130 |

**Test in Checkout**:
1. On pricing page, click KSH currency
2. On checkout with 3 months (20% discount):
   - S: 1,282 × 3 × 0.8 = 3,076.8 ≈ 3,077 KSH
   - M: 1,809 × 3 × 0.8 = 4,341.6 ≈ 4,342 KSH
   - L: 2,916 × 3 × 0.8 = 6,998.4 ≈ 6,998 KSH
   - XL: 5,130 × 3 × 0.8 = 12,312 KSH

### Scenario 13: Navbar Integration

**Objective**: Verify VPS link in navigation

**Steps**:
1. On any page, look at navbar (desktop only)
2. Hover over "Services" dropdown
3. Verify "VPS Hosting" appears with "NEW" badge
4. Click "VPS Hosting"
5. Should navigate to `/vps` pricing page

### Scenario 14: Mobile Responsiveness

**Objective**: Verify mobile experience

**Steps**:
1. Open `/vps` on mobile device or browser dev tools
2. Verify pricing cards stack vertically
3. Verify currency toggle is readable
4. On `/vps/checkout`:
   - Verify progress steps are visible
   - Verify summary panel stacks below form
   - Verify all buttons are clickable
   - Verify form inputs are appropriately sized
5. Test on various screen sizes:
   - iPhone SE (375px)
   - iPhone 12 (390px)
   - iPad (768px)
   - Desktop (1024px+)

## Edge Cases & Error Handling

### Test Edge Case 1: Double Submission

**Steps**:
1. On Step 5, click "Proceed to Payment" twice rapidly
2. System should prevent double submission
3. Should only create one Stripe session

### Test Edge Case 2: Session Expiry

**Steps**:
1. Start checkout, get to Step 5
2. Wait 24+ hours (or adjust test stripe session TTL)
3. Try to complete payment
4. Should show appropriate error message

### Test Edge Case 3: Invalid SSH Key

**Steps**:
1. Enter invalid SSH key (e.g., `invalid_key_here`)
2. Complete payment
3. Server provisioning might fail (validate in backend)
4. Should handle gracefully

### Test Edge Case 4: Special Characters in Hostname

**Steps**:
1. Enter hostname: `test-server.domain_123.com`
2. Should accept valid RFC hostnames
3. Reject: `test@server`, `test server`, `test!server`

## Stress Testing

### Load Test: Rapid Checkouts

**Steps**:
1. Open multiple checkout sessions simultaneously
2. Complete multiple payments in quick succession
3. Verify:
   - Each gets unique session ID
   - All emails are sent
   - No data corruption

### Webhook Retry Test

**Steps**:
1. In Stripe Dashboard, go to webhook endpoint
2. Manual retry recent delivery
3. Verify email is resent
4. Verify no duplicate emails or orders

## Regression Testing

After any code changes, re-test:

- [ ] Pricing calculations
- [ ] Currency conversion
- [ ] Promo code application
- [ ] Form validation
- [ ] Email delivery
- [ ] Webhook processing
- [ ] Success/cancel pages
- [ ] Navbar links

## Final Validation Checklist

- [ ] All 5 checkout steps work correctly
- [ ] Pricing is accurate with $2 margin
- [ ] Currency conversion is correct (1:135)
- [ ] Form validation works on all fields
- [ ] Promo codes are validated and applied
- [ ] Stripe payment processes successfully
- [ ] Webhook triggers automatically
- [ ] Customer email is sent with invoice
- [ ] Business email is sent with order details
- [ ] Success page shows order confirmation
- [ ] Cancel page handles cancellation
- [ ] All pages are responsive on mobile
- [ ] Navigation includes VPS link with badge
- [ ] Email contains all required information

## Sign-Off

Once all tests pass:

- [ ] Document any issues found
- [ ] Create GitHub issues if needed
- [ ] Mark as ready for production
- [ ] Switch from test to live Stripe keys
- [ ] Verify webhooks use live endpoint
- [ ] Test one more time with live key
- [ ] Go live!

---

**Test Version**: 1.0
**Last Updated**: March 28, 2026
