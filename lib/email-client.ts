// Client-side utility for sending emails via the API
// Usage: await sendEmail({ type: "welcome", data: { email, name } })

export type EmailType =
  | "welcome"
  | "vps-order-confirmation"
  | "vps-provisioned"
  | "password-reset"
  | "contact-form"
  | "newsletter"

interface EmailPayload {
  type: EmailType
  data: Record<string, any>
}

export async function sendEmail(payload: EmailPayload) {
  try {
    const response = await fetch("/api/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Failed to send email")
    }

    console.log("[Email] Sent successfully:", result.id)
    return result
  } catch (error) {
    console.error("[Email] Error sending email:", error)
    throw error
  }
}

// Specific email sending functions for common use cases
export const emailUtils = {
  // Send welcome email to new user
  sendWelcome: (email: string, name: string) =>
    sendEmail({
      type: "welcome",
      data: { email, name },
    }),

  // Send VPS order confirmation
  sendVpsOrderConfirmation: ({
    email,
    name,
    orderId,
    planName,
    location,
    os,
    hostname,
    billingCycle,
    totalAmount,
    currency,
  }: {
    email: string
    name: string
    orderId: string
    planName: string
    location: string
    os: string
    hostname: string
    billingCycle: string
    totalAmount: string
    currency: string
  }) =>
    sendEmail({
      type: "vps-order-confirmation",
      data: {
        email,
        name,
        orderId,
        planName,
        location,
        os,
        hostname,
        billingCycle,
        totalAmount,
        currency,
      },
    }),

  // Send VPS provisioned notification
  sendVpsProvisioned: ({
    email,
    name,
    orderId,
    planName,
    ipAddress,
    hostname,
    rootPassword,
    sshPort,
  }: {
    email: string
    name: string
    orderId: string
    planName: string
    ipAddress: string
    hostname: string
    rootPassword: string
    sshPort?: number
  }) =>
    sendEmail({
      type: "vps-provisioned",
      data: {
        email,
        name,
        orderId,
        planName,
        ipAddress,
        hostname,
        rootPassword,
        sshPort: sshPort || 22,
      },
    }),

  // Send password reset link
  sendPasswordReset: (email: string, name: string, resetLink: string) =>
    sendEmail({
      type: "password-reset",
      data: { email, name, resetLink },
    }),

  // Send contact form submission notification & auto-reply
  sendContactForm: ({
    email,
    name,
    phone,
    message,
    service,
  }: {
    email: string
    name: string
    phone?: string
    message: string
    service?: string
  }) =>
    sendEmail({
      type: "contact-form",
      data: { email, name, phone, message, service },
    }),

  // Send newsletter welcome email
  sendNewsletterWelcome: (email: string) =>
    sendEmail({
      type: "newsletter",
      data: { email },
    }),
}
