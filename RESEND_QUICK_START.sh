#!/bin/bash
# Quick Reference - Email Integration Commands

# =============================================================================
# RESEND SETUP QUICK START
# =============================================================================

echo "=== Resend Email Integration - Quick Start ==="
echo ""
echo "1. ENVIRONMENT VARIABLES"
echo "   RESEND_API_KEY has been added to your Vercel project"
echo ""

echo "2. DOMAIN VERIFICATION"
echo "   Visit: https://resend.com/domains"
echo "   Add domain: anonymiketech.online"
echo "   Complete DNS verification"
echo ""

echo "3. SEND WELCOME EMAIL (Example)"
cat << 'EOF'
import { emailUtils } from "@/lib/email-client"

await emailUtils.sendWelcome(
  "user@example.com",
  "John Doe"
)
EOF
echo ""

echo "4. SEND VPS ORDER EMAIL (Example)"
cat << 'EOF'
import { emailUtils } from "@/lib/email-client"

await emailUtils.sendVpsOrderConfirmation({
  email: "customer@example.com",
  name: "John Doe",
  orderId: "VPS-001",
  planName: "Pro VPS",
  location: "US (Dallas)",
  os: "Ubuntu 22.04",
  hostname: "server.com",
  billingCycle: "12 Months",
  totalAmount: "499.99",
  currency: "$"
})
EOF
echo ""

echo "5. SEND CONTACT FORM (Example)"
cat << 'EOF'
import { emailUtils } from "@/lib/email-client"

await emailUtils.sendContactForm({
  email: "contact@example.com",
  name: "John Doe",
  phone: "+971-50-123-4567",
  message: "Your message here",
  service: "VPS Hosting"
})
EOF
echo ""

echo "=== FILES CREATED ==="
echo "✓ /lib/resend.ts"
echo "✓ /lib/email-templates.ts"
echo "✓ /lib/email-client.ts"
echo "✓ /app/api/email/send/route.ts"
echo "✓ /types/email.ts"
echo "✓ /RESEND_SETUP.md (Full Documentation)"
echo "✓ /UPDATES.md (Change Summary)"
echo ""

echo "=== DOCUMENTATION ==="
echo "📖 Read RESEND_SETUP.md for complete integration guide"
echo "📖 Read UPDATES.md for all recent changes"
echo ""

echo "=== TESTING EMAILS ==="
echo "Visit: https://resend.com/messages"
echo "Check delivery status and email content"
echo ""

echo "=== SUPPORT ==="
echo "📚 Resend Docs: https://resend.com/docs"
echo "🆘 Resend Support: https://resend.com/support"
