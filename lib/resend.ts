import { Resend } from "resend"

// Initialize Resend with API key
export const resend = new Resend(process.env.RESEND_API_KEY)

// Default sender email - using verified domain
export const FROM_EMAIL = "AnonymikeTech <noreply@anonymiketech.online>"
export const SUPPORT_EMAIL = "support@anonymiketech.online"

// Email types
export type EmailTemplate =
  | "welcome"
  | "order-confirmation"
  | "vps-provisioned"
  | "password-reset"
  | "contact-form"
  | "newsletter"

// Common email sending function with error handling
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = FROM_EMAIL,
  replyTo = SUPPORT_EMAIL,
}: {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: text || stripHtml(html),
      reply_to: replyTo,
    })

    if (error) {
      console.error("[Resend] Error sending email:", error)
      return { success: false, error: error.message }
    }

    console.log("[Resend] Email sent successfully:", data?.id)
    return { success: true, id: data?.id }
  } catch (err) {
    console.error("[Resend] Failed to send email:", err)
    return { success: false, error: "Failed to send email" }
  }
}

// Helper to strip HTML tags for plain text version
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}
