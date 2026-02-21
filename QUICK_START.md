# Premium Apps Store - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Set Environment Variables
Add these to your `.env.local` file or Vercel project settings:

```
PAYFLOW_API_KEY=your_api_key_here
PAYFLOW_API_SECRET=your_api_secret_here
PAYFLOW_PAYMENT_ACCOUNT_ID=your_account_id_here
```

### Step 2: Run the Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### Step 3: Visit the Premium Apps Store
Navigate to: `http://localhost:3000/premium-apps`

### Step 4: Test the Payment Flow
1. Click "Buy Now" on any app
2. Enter a test phone number:
   - `254712345678` (international format)
   - `0712345678` (local format)
3. Click "Initiate M-Pesa Payment"
4. Wait for status checking
5. Enter a test transaction code: `AB12345` (6-15 alphanumeric)
6. Click "Validate Transaction"

## 📱 Phone Number Formats (All Valid)

The system accepts these formats:
```
254712345678    ✓ International (recommended)
+254712345678   ✓ With plus sign
0712345678      ✓ Local format
```

## 🎯 Key Pages

| Page | URL | Purpose |
|------|-----|---------|
| Premium Apps Store | `/premium-apps` | Browse and purchase apps |
| Main Home | `/` | See CTA for Premium Apps |
| Checkout | `/checkout` | Original checkout page |

## 🔧 How the Payment Works

```
User Input Phone
       ↓
Validate Phone (client-side)
       ↓
POST /api/premium-apps/initiate-payment
       ↓
Payflow API → M-Pesa STK Push
       ↓
Frontend polls /api/premium-apps/check-status
       ↓
User confirms M-Pesa on phone
       ↓
Status changes to "success"
       ↓
Ask for transaction code
       ↓
POST /api/premium-apps/validate-transaction
       ↓
Success screen
```

## 📊 Components Overview

### Payment Modal
- **File:** `/components/PremiumAppPaymentModal.tsx`
- **States:** phone → pending → validate → success/error
- **Props:** isOpen, onClose, appName, appIcon, price

### Premium Apps Page
- **File:** `/app/premium-apps/page.tsx`
- **Features:** App grid, hero section, features section
- **Responsive:** Mobile-first design

### API Routes
```
POST /api/premium-apps/initiate-payment
POST /api/premium-apps/check-status
POST /api/premium-apps/validate-transaction
```

## 🎨 Styling Reference

All components use:
- **Framework:** Tailwind CSS v4
- **Theme:** Green terminal (`#22c55e`)
- **Animations:** Framer Motion
- **Icons:** Lucide React

Key classes:
```
bg-slate-900          Dark background
border-green-500/30   Green borders
text-green-400        Green text
font-mono             Terminal font
```

## 🔍 Debugging Tips

### Enable Console Logging
Look for `[v0]` prefixed logs in browser console:
- Payment initiation
- Status checks
- Validation attempts
- Errors and warnings

### Test API Endpoints with curl
```bash
# Initiate payment
curl -X POST http://localhost:3000/api/premium-apps/initiate-payment \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "254712345678",
    "amount": 100,
    "appName": "Test App"
  }'

# Check status
curl -X POST http://localhost:3000/api/premium-apps/check-status \
  -H "Content-Type: application/json" \
  -d '{"checkoutRequestId": "abc123"}'

# Validate transaction
curl -X POST http://localhost:3000/api/premium-apps/validate-transaction \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "254712345678",
    "transactionCode": "AB12345",
    "checkoutRequestId": "abc123"
  }'
```

## ✅ Testing Checklist

Basic Flow:
- [ ] Page loads without errors
- [ ] App cards display correctly
- [ ] "Buy Now" button opens modal
- [ ] Phone input accepts all formats
- [ ] Validation shows errors for invalid phones
- [ ] Payment initiation works
- [ ] Status polling shows loading state
- [ ] Transaction code input appears
- [ ] Success screen displays

Error Handling:
- [ ] Invalid phone shows error
- [ ] Empty phone shows validation
- [ ] Network error shows retry option
- [ ] Invalid transaction code shows error
- [ ] Can retry after error

Responsive:
- [ ] Mobile layout looks good
- [ ] Tablet layout responsive
- [ ] Desktop layout optimized
- [ ] Modal displays correctly on all sizes

## 📝 Adding New Apps

Edit `/lib/premium-apps-data.ts`:

```typescript
{
  id: "unique-id",
  name: "App Name",
  description: "Short description",
  longDescription: "Detailed description",
  features: [
    "Feature 1",
    "Feature 2",
    "Feature 3",
    "Feature 4",
    "Feature 5",
    "Feature 6",
  ],
  price: 100,
  category: "Category Name",
  icon: "emoji", // Any emoji
  image: "/images/app.jpg",
  downloads: 0,
}
```

## 🐛 Common Issues & Solutions

### Credentials Not Loading
```
Error: "Payment service configuration error"
→ Check environment variables are set correctly
→ Restart dev server after adding env vars
```

### Phone Validation Fails
```
Error: "Please enter a valid Kenyan phone number"
→ Use format: 254712345678, 0712345678, or +254712345678
→ Ensure 10 digits after country code
```

### Status Never Updates
```
→ Check browser console for errors
→ Verify Payflow API credentials
→ Check network tab in DevTools
→ Ensure localhost:3000 is running
```

### Modal Won't Close
```
→ Click the X button in top-right
→ Or click "Try Again" after error
→ Full page reload if stuck
```

## 🔐 Security Notes

✓ Never share API credentials
✓ Always use HTTPS in production
✓ Environment variables stay server-side
✓ Phone numbers validated on client & server
✓ Transaction codes validated before use

## 📚 Documentation

For more details:
- **Implementation Guide:** `/docs/PREMIUM_APPS.md`
- **Full Implementation Details:** `/PREMIUM_APPS_IMPLEMENTATION.md`
- **Payflow API Docs:** https://payflow.top/api-doc.php

## 🎓 Learning Resources

- **Framer Motion:** https://www.framer.com/motion/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Next.js:** https://nextjs.org/docs
- **React Hooks:** https://react.dev/reference/react/hooks
- **TypeScript:** https://www.typescriptlang.org/docs/

## 💡 Tips & Tricks

### Customizing Colors
All colors use CSS variables in `globals.css`:
```css
--green-500: #22c55e
/* Update here to change theme everywhere */
```

### Adjusting Polling Intervals
In `PremiumAppPaymentModal.tsx`:
```typescript
// Initial polling (3 seconds)
setTimeout(() => pollPaymentStatus(data.checkoutRequestId), 3000)

// Ongoing polling (2 seconds)
setTimeout(() => pollPaymentStatus(requestId), 2000)
```

### Testing with Different Apps
Modal shows different icons/names based on the app you select.
Try clicking "Buy Now" on each app to see the modal adapt.

## 📞 Support

If you encounter issues:
1. Check the browser console for `[v0]` logs
2. Review the documentation files
3. Verify environment variables
4. Check Payflow API status
5. Restart the dev server
6. Clear browser cache

## 🚀 Deploy to Production

1. Set environment variables in Vercel project settings
2. Use production Payflow credentials
3. Run `npm run build` to verify no errors
4. Deploy to Vercel or your hosting platform
5. Test payment flow with real M-Pesa account
6. Monitor logs for any issues

---

**Happy coding! 🎉**
