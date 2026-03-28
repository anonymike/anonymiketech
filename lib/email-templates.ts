// Email template generator for AnonymikeTech
// Domain: https://www.anonymiketech.online/

const BRAND_COLOR = "#3B82F6"
const BRAND_NAME = "AnonymikeTech"
const WEBSITE_URL = "https://www.anonymiketech.online"
const SUPPORT_EMAIL = "support@anonymiketech.online"

// Base email wrapper with consistent styling
function baseTemplate(content: string, preheader?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BRAND_NAME}</title>
  ${preheader ? `<span style="display:none;max-height:0;overflow:hidden">${preheader}</span>` : ""}
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#f1f5f9">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9">
    <tr>
      <td align="center" style="padding:40px 20px">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:32px;text-align:center">
              <h1 style="margin:0;font-size:28px;font-weight:bold;color:#ffffff">${BRAND_NAME}</h1>
              <p style="margin:8px 0 0;color:#94a3b8;font-size:14px">Tech Solutions & Digital Services</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px 32px">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:24px 32px;text-align:center;border-top:1px solid #e2e8f0">
              <p style="margin:0 0 8px;color:#64748b;font-size:13px">
                &copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.
              </p>
              <p style="margin:0;color:#64748b;font-size:12px">
                <a href="${WEBSITE_URL}" style="color:${BRAND_COLOR};text-decoration:none">Website</a> &nbsp;|&nbsp;
                <a href="mailto:${SUPPORT_EMAIL}" style="color:${BRAND_COLOR};text-decoration:none">Support</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

// Welcome email for new users
export function welcomeEmail(name: string): string {
  return baseTemplate(
    `
    <h2 style="margin:0 0 16px;font-size:24px;color:#0f172a">Welcome to ${BRAND_NAME}!</h2>
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6">
      Hi ${name},
    </p>
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6">
      Thank you for joining ${BRAND_NAME}! We're excited to have you on board. You now have access to our full range of digital services including:
    </p>
    <ul style="margin:0 0 24px;padding-left:20px;color:#475569;font-size:16px;line-height:1.8">
      <li>VPS Hosting Solutions</li>
      <li>AI Chatbot Development</li>
      <li>Custom Software Development</li>
      <li>Digital Marketing Services</li>
    </ul>
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6">
      Explore our services and let us help you achieve your digital goals.
    </p>
    <a href="${WEBSITE_URL}" style="display:inline-block;padding:14px 32px;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px">
      Explore Services
    </a>
    `,
    `Welcome to ${BRAND_NAME}! Start exploring our digital services.`
  )
}

// VPS Order Confirmation
export function vpsOrderConfirmationEmail({
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
  name: string
  orderId: string
  planName: string
  location: string
  os: string
  hostname: string
  billingCycle: string
  totalAmount: string
  currency: string
}): string {
  return baseTemplate(
    `
    <h2 style="margin:0 0 16px;font-size:24px;color:#0f172a">Order Confirmed!</h2>
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6">
      Hi ${name},
    </p>
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6">
      Thank you for your VPS order! We've received your payment and your server is being provisioned.
    </p>
    
    <div style="background-color:#f8fafc;border-radius:8px;padding:24px;margin-bottom:24px;border:1px solid #e2e8f0">
      <h3 style="margin:0 0 16px;font-size:18px;color:#0f172a">Order Details</h3>
      <table style="width:100%;font-size:14px;color:#475569">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0"><strong>Order ID:</strong></td>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace">${orderId}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0"><strong>Plan:</strong></td>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right">${planName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0"><strong>Location:</strong></td>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right">${location}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0"><strong>OS:</strong></td>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right">${os}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0"><strong>Hostname:</strong></td>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace">${hostname || "Auto-generated"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0"><strong>Billing:</strong></td>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right">${billingCycle}</td>
        </tr>
        <tr>
          <td style="padding:8px 0"><strong>Total:</strong></td>
          <td style="padding:8px 0;text-align:right;font-size:18px;font-weight:bold;color:${BRAND_COLOR}">${currency}${totalAmount}</td>
        </tr>
      </table>
    </div>
    
    <div style="background-color:#ecfdf5;border-radius:8px;padding:16px;margin-bottom:24px;border:1px solid #a7f3d0">
      <p style="margin:0;color:#065f46;font-size:14px">
        <strong>Setup Fee:</strong> FREE - No additional charges!
      </p>
    </div>
    
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6">
      You'll receive another email with your server credentials once provisioning is complete (usually within 15 minutes).
    </p>
    
    <a href="${WEBSITE_URL}/vps/dashboard" style="display:inline-block;padding:14px 32px;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px">
      View Dashboard
    </a>
    `,
    `Order #${orderId} confirmed! Your VPS is being provisioned.`
  )
}

// VPS Provisioned / Ready
export function vpsProvisionedEmail({
  name,
  orderId,
  planName,
  ipAddress,
  hostname,
  rootPassword,
  sshPort,
}: {
  name: string
  orderId: string
  planName: string
  ipAddress: string
  hostname: string
  rootPassword: string
  sshPort: number
}): string {
  return baseTemplate(
    `
    <div style="background-color:#ecfdf5;border-radius:8px;padding:16px;margin-bottom:24px;border:1px solid #a7f3d0;text-align:center">
      <p style="margin:0;color:#065f46;font-size:18px;font-weight:bold">
        Your VPS is Ready!
      </p>
    </div>
    
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6">
      Hi ${name},
    </p>
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6">
      Great news! Your ${planName} server has been provisioned and is ready to use.
    </p>
    
    <div style="background-color:#0f172a;border-radius:8px;padding:24px;margin-bottom:24px">
      <h3 style="margin:0 0 16px;font-size:16px;color:#94a3b8">Server Credentials</h3>
      <table style="width:100%;font-size:14px;color:#e2e8f0;font-family:monospace">
        <tr>
          <td style="padding:8px 0;color:#94a3b8">IP Address:</td>
          <td style="padding:8px 0;text-align:right;color:#22d3ee">${ipAddress}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94a3b8">Hostname:</td>
          <td style="padding:8px 0;text-align:right">${hostname}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94a3b8">SSH Port:</td>
          <td style="padding:8px 0;text-align:right">${sshPort}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94a3b8">Username:</td>
          <td style="padding:8px 0;text-align:right">root</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94a3b8">Password:</td>
          <td style="padding:8px 0;text-align:right;color:#fbbf24">${rootPassword}</td>
        </tr>
      </table>
    </div>
    
    <div style="background-color:#fef3c7;border-radius:8px;padding:16px;margin-bottom:24px;border:1px solid #fcd34d">
      <p style="margin:0;color:#92400e;font-size:14px">
        <strong>Security Notice:</strong> Please change your root password immediately after first login.
      </p>
    </div>
    
    <p style="margin:0 0 16px;color:#475569;font-size:16px;line-height:1.6">
      <strong>Connect via SSH:</strong>
    </p>
    <div style="background-color:#1e293b;border-radius:8px;padding:16px;margin-bottom:24px;font-family:monospace;font-size:14px;color:#22d3ee">
      ssh root@${ipAddress} -p ${sshPort}
    </div>
    
    <a href="${WEBSITE_URL}/vps/dashboard" style="display:inline-block;padding:14px 32px;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px">
      Manage Server
    </a>
    `,
    `Your VPS is ready! IP: ${ipAddress}`
  )
}

// Password Reset Email
export function passwordResetEmail(name: string, resetLink: string): string {
  return baseTemplate(
    `
    <h2 style="margin:0 0 16px;font-size:24px;color:#0f172a">Reset Your Password</h2>
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6">
      Hi ${name},
    </p>
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6">
      We received a request to reset your password. Click the button below to create a new password:
    </p>
    <a href="${resetLink}" style="display:inline-block;padding:14px 32px;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;margin-bottom:24px">
      Reset Password
    </a>
    <p style="margin:24px 0 0;color:#64748b;font-size:14px;line-height:1.6">
      This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
    </p>
    `,
    `Reset your ${BRAND_NAME} password`
  )
}

// Contact Form Notification (to admin)
export function contactFormEmail({
  name,
  email,
  phone,
  message,
  service,
}: {
  name: string
  email: string
  phone?: string
  message: string
  service?: string
}): string {
  return baseTemplate(
    `
    <h2 style="margin:0 0 16px;font-size:24px;color:#0f172a">New Contact Form Submission</h2>
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6">
      You've received a new inquiry from the website:
    </p>
    
    <div style="background-color:#f8fafc;border-radius:8px;padding:24px;margin-bottom:24px;border:1px solid #e2e8f0">
      <table style="width:100%;font-size:14px;color:#475569">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;width:100px"><strong>Name:</strong></td>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0">${name}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0"><strong>Email:</strong></td>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0">
            <a href="mailto:${email}" style="color:${BRAND_COLOR}">${email}</a>
          </td>
        </tr>
        ${
          phone
            ? `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0"><strong>Phone:</strong></td>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0">${phone}</td>
        </tr>
        `
            : ""
        }
        ${
          service
            ? `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0"><strong>Service:</strong></td>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0">${service}</td>
        </tr>
        `
            : ""
        }
      </table>
    </div>
    
    <div style="background-color:#f8fafc;border-radius:8px;padding:24px;border:1px solid #e2e8f0">
      <h3 style="margin:0 0 12px;font-size:16px;color:#0f172a">Message:</h3>
      <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;white-space:pre-wrap">${message}</p>
    </div>
    
    <p style="margin:24px 0 0">
      <a href="mailto:${email}" style="display:inline-block;padding:14px 32px;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px">
        Reply to ${name}
      </a>
    </p>
    `,
    `New contact from ${name}`
  )
}

// Contact Form Auto-Reply (to sender)
export function contactFormAutoReplyEmail(name: string): string {
  return baseTemplate(
    `
    <h2 style="margin:0 0 16px;font-size:24px;color:#0f172a">We've Received Your Message!</h2>
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6">
      Hi ${name},
    </p>
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6">
      Thank you for reaching out to ${BRAND_NAME}! We've received your message and our team will get back to you within 24-48 hours.
    </p>
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6">
      In the meantime, feel free to explore our services:
    </p>
    <ul style="margin:0 0 24px;padding-left:20px;color:#475569;font-size:16px;line-height:1.8">
      <li><a href="${WEBSITE_URL}/vps" style="color:${BRAND_COLOR}">VPS Hosting</a></li>
      <li><a href="${WEBSITE_URL}/chatbots-ai" style="color:${BRAND_COLOR}">AI Chatbots</a></li>
      <li><a href="${WEBSITE_URL}/portfolio" style="color:${BRAND_COLOR}">Our Portfolio</a></li>
    </ul>
    <p style="margin:0;color:#475569;font-size:16px;line-height:1.6">
      Best regards,<br>
      <strong>The ${BRAND_NAME} Team</strong>
    </p>
    `,
    `Thanks for contacting ${BRAND_NAME}!`
  )
}

// Newsletter Subscription
export function newsletterWelcomeEmail(email: string): string {
  return baseTemplate(
    `
    <h2 style="margin:0 0 16px;font-size:24px;color:#0f172a">You're Subscribed!</h2>
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6">
      Thank you for subscribing to the ${BRAND_NAME} newsletter!
    </p>
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6">
      You'll now receive updates on:
    </p>
    <ul style="margin:0 0 24px;padding-left:20px;color:#475569;font-size:16px;line-height:1.8">
      <li>New service launches and features</li>
      <li>Exclusive discounts and promotions</li>
      <li>Tech tips and industry insights</li>
      <li>Company news and updates</li>
    </ul>
    <a href="${WEBSITE_URL}" style="display:inline-block;padding:14px 32px;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px">
      Visit Our Website
    </a>
    <p style="margin:24px 0 0;color:#64748b;font-size:12px">
      You can unsubscribe at any time by clicking the unsubscribe link in our emails.
    </p>
    `,
    `Welcome to the ${BRAND_NAME} newsletter!`
  )
}
