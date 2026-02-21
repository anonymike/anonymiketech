# Premium Apps Store - Implementation Guide

## Overview
The Premium Apps Store is a full-featured e-commerce platform for selling professional developer tools via M-Pesa STK Push payments. Users can purchase apps for KSH 100 each with secure payment validation.

## Architecture

### Components
1. **PremiumAppPaymentModal** (`/components/PremiumAppPaymentModal.tsx`)
   - Handles the complete payment flow
   - Phone number validation (Kenyan numbers)
   - M-Pesa STK Push initiation
   - Transaction code validation
   - Success/error state management

### Pages
1. **Premium Apps Page** (`/app/premium-apps/page.tsx`)
   - Displays all available apps in a grid
   - App cards with features, downloads, and pricing
   - Hero section with stats
   - Features and benefits section
   - Responsive design (mobile-first)

### API Routes
1. **Initiate Payment** (`/app/api/premium-apps/initiate-payment/route.ts`)
   - POST endpoint
   - Calls Payflow STK Push API
   - Returns checkout_request_id for polling

2. **Check Payment Status** (`/app/api/premium-apps/check-status/route.ts`)
   - POST endpoint
   - Polls Payflow for payment status
   - Handles pending, success, and failed states

3. **Validate Transaction** (`/app/api/premium-apps/validate-transaction/route.ts`)
   - POST endpoint
   - Validates transaction code from user
   - Stores validated transactions in-memory
   - GET endpoint to verify existing transactions

### Data
**Premium Apps** (`/lib/premium-apps-data.ts`)
- Data structure for all apps
- Features, descriptions, icons, pricing
- Download statistics

## Payment Flow

```
1. User clicks "Buy Now" on an app
   ↓
2. Payment modal opens with phone input
   ↓
3. User enters phone number (validated)
   ↓
4. "Initiate M-Pesa Payment" clicked
   ↓
5. API calls Payflow to start STK Push
   ↓
6. Returns checkout_request_id
   ↓
7. Frontend polls "Check Status" endpoint
   ↓
8. User confirms M-Pesa prompt on phone
   ↓
9. Status changes to "success"
   ↓
10. Modal transitions to "validate" step
    ↓
11. User enters transaction code from SMS
    ↓
12. Code is validated
    ↓
13. Success screen shown
    ↓
14. User closes modal
```

## Configuration

### Environment Variables Required
```
PAYFLOW_API_KEY=your_api_key
PAYFLOW_API_SECRET=your_api_secret
PAYFLOW_PAYMENT_ACCOUNT_ID=your_account_id
```

Add these to your `.env.local` or Vercel project settings.

### Payflow API Reference
**Base URL:** `https://payflow.top/api/v2`

**STK Push Endpoint:** `/stkpush.php`
```json
{
  "payment_account_id": 123,
  "phone": "254712345678",
  "amount": 100,
  "reference": "PREMIUM_APP_123456",
  "description": "Purchase: App Name"
}
```

**Check Status Endpoint:** `/checkstatus.php`
```json
{
  "checkout_request_id": "abc123def456"
}
```

## Phone Number Validation

The system accepts Kenyan phone numbers in multiple formats:
- `254712345678` (international)
- `+254712345678` (with +)
- `0712345678` (local format)

All are converted to `254XXXXXXXXX` format for API calls.

## Customization

### Adding New Apps
Edit `/lib/premium-apps-data.ts`:
```typescript
{
  id: "unique-id",
  name: "App Name",
  description: "Short description",
  longDescription: "Detailed description",
  features: ["Feature 1", "Feature 2", ...],
  price: 100,
  category: "Category",
  icon: "emoji",
  image: "/path/to/image.jpg",
  downloads: 0,
}
```

### Styling
- Uses Tailwind CSS v4
- Green terminal theme (#22c55e)
- Responsive grid layout
- Framer Motion animations
- Dark background (slate-900/black)

## Production Considerations

1. **Database Integration**
   - Currently uses in-memory storage for transactions
   - Implement persistent storage (PostgreSQL, MongoDB, etc.)
   - Store transaction history for refunds and audits

2. **Authentication**
   - Add user accounts system
   - Track purchases per user
   - Prevent duplicate purchases

3. **Payment Verification**
   - Implement webhook verification from Payflow
   - Cross-validate transaction codes
   - Handle failed/pending payments better

4. **Security**
   - Never expose API credentials in frontend
   - Always validate inputs server-side
   - Use HTTPS only
   - Implement rate limiting on API endpoints

5. **User Experience**
   - Add email confirmation after purchase
   - Generate download/access tokens
   - Implement license management
   - Add purchase history page

6. **Error Handling**
   - Log all errors to monitoring system
   - Provide clear error messages
   - Implement retry logic with exponential backoff
   - Add support ticket integration

## Testing

### Local Testing
1. Set environment variables in `.env.local`
2. Use Payflow test credentials
3. Test all phone number formats
4. Verify error states (invalid phone, failed payment, etc.)

### API Testing
Use curl or Postman:
```bash
curl -X POST http://localhost:3000/api/premium-apps/initiate-payment \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "254712345678",
    "amount": 100,
    "appName": "Test App"
  }'
```

## Support & Documentation
- Payflow API: https://payflow.top/api-doc.php
- M-Pesa Integration: Standard STK Push flow
- Framer Motion: https://www.framer.com/motion/
- Next.js: https://nextjs.org/docs

## Troubleshooting

### Payment not initiating
- Check Payflow API credentials
- Verify phone number format
- Check network connectivity
- Review console logs

### Status check hanging
- Increase poll timeout
- Check Payflow API status
- Verify checkout_request_id is correct

### Transaction validation failing
- Ensure transaction code is correct format
- Check if code was already used
- Verify checkoutRequestId matches

## Future Enhancements
- [ ] Digital delivery/downloads
- [ ] Subscription plans
- [ ] License key generation
- [ ] Refund management
- [ ] Admin dashboard
- [ ] Analytics & reporting
- [ ] Multi-currency support
- [ ] Alternative payment methods
