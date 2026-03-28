import { NextRequest, NextResponse } from "next/server"
import { sendEmail, FROM_EMAIL, SUPPORT_EMAIL } from "@/lib/resend"
import {
  welcomeEmail,
  vpsOrderConfirmationEmail,
  vpsProvisionedEmail,
  passwordResetEmail,
  contactFormEmail,
  contactFormAutoReplyEmail,
  newsletterWelcomeEmail,
} from "@/lib/email-templates"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json({ error: "Missing type or data" }, { status: 400 })
    }

    let result
    let subject = ""
    let html = ""
    let to = ""

    switch (type) {
      case "welcome":
        to = data.email
        subject = "Welcome to AnonymikeTech!"
        html = welcomeEmail(data.name)
        break

      case "vps-order-confirmation":
        to = data.email
        subject = `Order Confirmed - ${data.orderId}`
        html = vpsOrderConfirmationEmail({
          name: data.name,
          orderId: data.orderId,
          planName: data.planName,
          location: data.location,
          os: data.os,
          hostname: data.hostname,
          billingCycle: data.billingCycle,
          totalAmount: data.totalAmount,
          currency: data.currency,
        })
        break

      case "vps-provisioned":
        to = data.email
        subject = `Your VPS is Ready - ${data.orderId}`
        html = vpsProvisionedEmail({
          name: data.name,
          orderId: data.orderId,
          planName: data.planName,
          ipAddress: data.ipAddress,
          hostname: data.hostname,
          rootPassword: data.rootPassword,
          sshPort: data.sshPort || 22,
        })
        break

      case "password-reset":
        to = data.email
        subject = "Reset Your Password - AnonymikeTech"
        html = passwordResetEmail(data.name, data.resetLink)
        break

      case "contact-form":
        // Send notification to admin
        result = await sendEmail({
          to: SUPPORT_EMAIL,
          subject: `New Contact Form: ${data.name} - ${data.service || "General Inquiry"}`,
          html: contactFormEmail({
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message,
            service: data.service,
          }),
          replyTo: data.email,
        })

        // Send auto-reply to sender
        if (result.success) {
          await sendEmail({
            to: data.email,
            subject: "We've Received Your Message - AnonymikeTech",
            html: contactFormAutoReplyEmail(data.name),
          })
        }

        return NextResponse.json(result)

      case "newsletter":
        to = data.email
        subject = "Welcome to the AnonymikeTech Newsletter!"
        html = newsletterWelcomeEmail(data.email)
        break

      default:
        return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
    }

    result = await sendEmail({ to, subject, html })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: result.id })
  } catch (error) {
    console.error("[Email API] Error:", error)
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    )
  }
}
