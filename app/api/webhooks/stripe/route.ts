import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY!)

const LOCATIONS: Record<string, string> = {
  "us-dallas": "US (Dallas)",
  "de-frankfurt": "Germany (Frankfurt)",
  "za-johannesburg": "South Africa (Johannesburg)",
  "ae-dubai": "UAE (Dubai)",
  "sg-singapore": "Singapore",
}

const OPERATING_SYSTEMS: Record<string, string> = {
  ubuntu: "Ubuntu 24.04",
  debian: "Debian 12",
  almalinux: "AlmaLinux 9",
  archlinux: "Arch Linux (Latest)",
  windows: "Windows Server 2022",
}

const PLAN_DETAILS = {
  "s-plan": { name: "VPS S - Starter", cpu: 3, ram: 6, storage: 50 },
  "m-plan": { name: "VPS M - Professional", cpu: 6, ram: 16, storage: 100 },
  "l-plan": { name: "VPS L - Business", cpu: 8, ram: 32, storage: 200 },
  "xl-plan": { name: "VPS XL - Enterprise", cpu: 12, ram: 64, storage: 400 },
}

async function generateInvoicePDF(orderData: any, amount: number, currency: string) {
  // Simple HTML invoice that can be converted to PDF by email service
  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .invoice-title { font-size: 28px; margin: 0; }
        .invoice-number { font-size: 12px; margin-top: 5px; opacity: 0.9; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; font-weight: bold; }
        td { padding: 10px; border-bottom: 1px solid #eee; }
        .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; padding-top: 10px; border-top: 2px solid #ddd; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="invoice-title">INVOICE</h1>
          <p class="invoice-number">Invoice #${Date.now()}</p>
        </div>

        <h3>Order Details</h3>
        <table>
          <tr>
            <th>Description</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>Plan</td>
            <td>${orderData.planName}</td>
          </tr>
          <tr>
            <td>Location</td>
            <td>${orderData.location}</td>
          </tr>
          <tr>
            <td>Operating System</td>
            <td>${orderData.os}</td>
          </tr>
          <tr>
            <td>Hostname</td>
            <td>${orderData.hostname}</td>
          </tr>
          <tr>
            <td>Billing Cycle</td>
            <td>${orderData.billingCycle}</td>
          </tr>
        </table>

        <h3>Pricing Breakdown</h3>
        <table>
          <tr>
            <td>Subtotal</td>
            <td>${currency === "KSH" ? "KSH " : "$"}${(amount / (currency === "KSH" ? 1 : 100)).toFixed(currency === "KSH" ? 0 : 2)}</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: right;"><strong>Total: ${currency === "KSH" ? "KSH " : "$"}${(amount / (currency === "KSH" ? 1 : 100)).toFixed(currency === "KSH" ? 0 : 2)}</strong></td>
          </tr>
        </table>

        <div class="footer">
          <p>Thank you for your purchase!</p>
          <p>Your server will be ready within 10 minutes. You will receive login credentials via email shortly.</p>
          <p>For support, contact: <strong>anonymiketech@gmail.com</strong></p>
        </div>
      </div>
    </body>
    </html>
  `

  return invoiceHTML
}

async function handlePaymentSuccess(session: Stripe.Checkout.Session) {
  const metadata = session.metadata
  if (!metadata) return

  const orderData = {
    planId: metadata.planId,
    planName: PLAN_DETAILS[metadata.planId as keyof typeof PLAN_DETAILS].name,
    location: LOCATIONS[metadata.location] || metadata.location,
    billingCycle: metadata.billingCycle,
    os: OPERATING_SYSTEMS[metadata.os] || metadata.os,
    hostname: metadata.hostname,
    currency: metadata.currency,
    promoCode: metadata.promoCode === "none" ? null : metadata.promoCode,
  }

  const amountPaid = session.amount_total || 0
  const customerEmail = session.customer_details?.email || session.customer_email || "customer@example.com"

  // Generate invoice HTML
  const invoiceHTML = await generateInvoicePDF(orderData, amountPaid, orderData.currency)

  // Send email to customer
  try {
    await resend.emails.send({
      from: "orders@anonymiketech.com",
      to: customerEmail,
      subject: `VPS Order Confirmation - ${orderData.planName}`,
      html: invoiceHTML,
    })
  } catch (error) {
    console.error("Error sending customer email:", error)
  }

  // Send email to business
  try {
    const businessEmailContent = `
      <h2>New VPS Order</h2>
      <p><strong>Customer Email:</strong> ${customerEmail}</p>
      <p><strong>Plan:</strong> ${orderData.planName}</p>
      <p><strong>Location:</strong> ${orderData.location}</p>
      <p><strong>OS:</strong> ${orderData.os}</p>
      <p><strong>Hostname:</strong> ${orderData.hostname}</p>
      <p><strong>Amount:</strong> ${orderData.currency === "KSH" ? "KSH " : "$"}${(amountPaid / (orderData.currency === "KSH" ? 1 : 100)).toFixed(orderData.currency === "KSH" ? 0 : 2)}</p>
      <p><strong>Order ID:</strong> ${session.id}</p>
    `

    await resend.emails.send({
      from: "orders@anonymiketech.com",
      to: "anonymiketech@gmail.com",
      subject: `New VPS Order - ${customerEmail}`,
      html: businessEmailContent,
    })
  } catch (error) {
    console.error("Error sending business email:", error)
  }

  // Log the successful order
  console.log("Order processed successfully:", {
    sessionId: session.id,
    customerEmail,
    orderData,
    amount: amountPaid,
  })
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      await handlePaymentSuccess(session)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    )
  }
}
