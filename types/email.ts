// Type definitions for email system
// Use these types across your application for type-safe email handling

// Email type enum
export enum EmailType {
  WELCOME = "welcome",
  VPS_ORDER_CONFIRMATION = "vps-order-confirmation",
  VPS_PROVISIONED = "vps-provisioned",
  PASSWORD_RESET = "password-reset",
  CONTACT_FORM = "contact-form",
  NEWSLETTER = "newsletter",
}

// Base email data that all emails share
export interface BaseEmailData {
  email: string
}

// Welcome email
export interface WelcomeEmailData extends BaseEmailData {
  name: string
}

// VPS Order Confirmation
export interface VpsOrderConfirmationData extends BaseEmailData {
  name: string
  orderId: string
  planName: string
  location: string
  os: string
  hostname: string
  billingCycle: string
  totalAmount: string
  currency: string
}

// VPS Provisioned
export interface VpsProvisionedData extends BaseEmailData {
  name: string
  orderId: string
  planName: string
  ipAddress: string
  hostname: string
  rootPassword: string
  sshPort?: number
}

// Password Reset
export interface PasswordResetData extends BaseEmailData {
  name: string
  resetLink: string
}

// Contact Form
export interface ContactFormData extends BaseEmailData {
  name: string
  phone?: string
  message: string
  service?: string
}

// Newsletter
export interface NewsletterData extends BaseEmailData {}

// Union type for all email data
export type EmailData =
  | WelcomeEmailData
  | VpsOrderConfirmationData
  | VpsProvisionedData
  | PasswordResetData
  | ContactFormData
  | NewsletterData

// Email payload sent to API
export interface EmailPayload<T extends EmailData = EmailData> {
  type: EmailType | string
  data: T
}

// API Response
export interface EmailApiResponse {
  success: boolean
  id?: string
  error?: string
}

// Resend API Response
export interface ResendResponse {
  success: boolean
  id?: string
  error?: string | object
}
