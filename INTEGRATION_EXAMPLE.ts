// Example Integration: VPS Checkout with Email Confirmation
// This shows how to integrate email sending into your VPS checkout flow

import { emailUtils } from "@/lib/email-client"
import { VpsOrderConfirmationData } from "@/types/email"

/**
 * Example: Send order confirmation after successful VPS purchase
 * 
 * Call this function after payment is processed
 */
export async function sendVpsOrderConfirmationEmail(
  customerData: {
    email: string
    name: string
    orderId: string
    planName: string
    location: string
    os: string
    hostname?: string
    billingCycle: string
    totalAmount: string
    currency: string
  }
) {
  try {
    console.log(`[VPS] Sending order confirmation email to ${customerData.email}`)

    const result = await emailUtils.sendVpsOrderConfirmation({
      email: customerData.email,
      name: customerData.name,
      orderId: customerData.orderId,
      planName: customerData.planName,
      location: customerData.location,
      os: customerData.os,
      hostname: customerData.hostname || "",
      billingCycle: customerData.billingCycle,
      totalAmount: customerData.totalAmount,
      currency: customerData.currency,
    })

    console.log(`[VPS] Order email sent successfully: ${result.id}`)
    return result
  } catch (error) {
    // Email failure shouldn't block order success
    // Log the error but don't throw
    console.error("[VPS] Failed to send order confirmation email:", error)
    return { success: false, error: String(error) }
  }
}

/**
 * Example: Send provisioned notification when server is ready
 * 
 * Call this after server provisioning is complete
 */
export async function sendVpsProvisionedEmail(
  customerData: {
    email: string
    name: string
    orderId: string
    planName: string
    ipAddress: string
    hostname: string
    rootPassword: string
    sshPort?: number
  }
) {
  try {
    console.log(`[VPS] Sending provisioned notification to ${customerData.email}`)

    const result = await emailUtils.sendVpsProvisioned({
      email: customerData.email,
      name: customerData.name,
      orderId: customerData.orderId,
      planName: customerData.planName,
      ipAddress: customerData.ipAddress,
      hostname: customerData.hostname,
      rootPassword: customerData.rootPassword,
      sshPort: customerData.sshPort || 22,
    })

    console.log(`[VPS] Provisioned email sent successfully: ${result.id}`)
    return result
  } catch (error) {
    console.error("[VPS] Failed to send provisioned email:", error)
    return { success: false, error: String(error) }
  }
}

/**
 * Example: Full checkout flow integration
 * 
 * This shows where to call email functions in your checkout process
 */
export async function processVpsCheckout(orderData: {
  // Order details
  orderId: string
  planName: string
  location: string
  os: string
  hostname?: string
  billingCycle: string
  totalAmount: string
  currency: string

  // Customer details
  email: string
  name: string

  // Server credentials (generated after provisioning)
  ipAddress?: string
  rootPassword?: string
  sshPort?: number
}) {
  try {
    // Step 1: Process payment
    console.log("[Checkout] Processing payment...")
    // ... payment logic here ...

    // Step 2: Send order confirmation email immediately
    console.log("[Checkout] Order confirmed, sending email...")
    await sendVpsOrderConfirmationEmail({
      email: orderData.email,
      name: orderData.name,
      orderId: orderData.orderId,
      planName: orderData.planName,
      location: orderData.location,
      os: orderData.os,
      hostname: orderData.hostname,
      billingCycle: orderData.billingCycle,
      totalAmount: orderData.totalAmount,
      currency: orderData.currency,
    })

    // Step 3: Provision server
    console.log("[Checkout] Provisioning server...")
    // ... server provisioning logic here ...

    // Step 4: Send provisioned email with credentials
    if (orderData.ipAddress && orderData.rootPassword) {
      console.log("[Checkout] Server ready, sending credentials email...")
      await sendVpsProvisionedEmail({
        email: orderData.email,
        name: orderData.name,
        orderId: orderData.orderId,
        planName: orderData.planName,
        ipAddress: orderData.ipAddress,
        hostname: orderData.hostname || orderData.orderId,
        rootPassword: orderData.rootPassword,
        sshPort: orderData.sshPort || 22,
      })
    }

    console.log("[Checkout] Order process complete!")
    return { success: true, orderId: orderData.orderId }
  } catch (error) {
    console.error("[Checkout] Error:", error)
    throw error
  }
}

/**
 * Example Usage in Your VPS Checkout Page:
 * 
 * After user completes payment and order is created:
 */

// In your checkout completion handler:
/*
async function handleCheckoutComplete(formData: CheckoutFormData) {
  try {
    // Create order in database
    const order = await createVpsOrder({
      planId: formData.planId,
      locationId: formData.locationId,
      os: formData.os,
      hostname: formData.hostname,
      customerId: currentUser.id,
    })

    // Process payment
    const payment = await processPayment({
      orderId: order.id,
      amount: order.totalPrice,
      customerId: currentUser.id,
    })

    if (!payment.success) {
      throw new Error("Payment failed")
    }

    // Send order confirmation email
    await sendVpsOrderConfirmationEmail({
      email: currentUser.email,
      name: currentUser.name,
      orderId: order.id,
      planName: formData.planName,
      location: formData.location,
      os: formData.os,
      hostname: formData.hostname,
      billingCycle: `${formData.months} Months`,
      totalAmount: order.totalPrice.toFixed(2),
      currency: order.currency,
    })

    // Trigger server provisioning in background
    triggerServerProvisioning(order.id) // Non-blocking

    // Redirect to success page
    router.push(`/vps/order-success?orderId=${order.id}`)
  } catch (error) {
    console.error("Checkout error:", error)
    setError(error.message)
  }
}
*/

/**
 * Example: Trigger email from server action or API route
 */

// In /app/api/vps/orders/route.ts or similar:
/*
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Create order
    const order = await db.vpsOrders.create({
      ...data,
    })

    // Send confirmation email asynchronously
    // This won't block the response
    sendVpsOrderConfirmationEmail({
      email: data.customerEmail,
      name: data.customerName,
      orderId: order.id,
      planName: data.planName,
      location: data.location,
      os: data.os,
      hostname: data.hostname,
      billingCycle: data.billingCycle,
      totalAmount: data.totalAmount,
      currency: data.currency,
    }).catch((err) => {
      // Log error but don't fail the order
      console.error("[Email] Failed to send order email:", err)
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}
*/

/**
 * Best Practices:
 * 
 * 1. Always use try-catch around email sends
 * 2. Don't block user experience waiting for email
 * 3. Log email failures for monitoring
 * 4. Send emails asynchronously after main operation completes
 * 5. Consider retry logic for failed emails
 * 6. Store email status in database for tracking
 */

export default {
  sendVpsOrderConfirmationEmail,
  sendVpsProvisionedEmail,
  processVpsCheckout,
}
