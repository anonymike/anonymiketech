# Supabase Email Authentication Templates Setup

This guide shows you how to configure email templates for your chatbots-ai authentication system. Users will receive professional emails for signup confirmation, password reset, and other authentication events.

## Overview of Email Templates

Supabase provides several email template types that automatically get sent to users:

1. **Confirm sign up** - Sent after user creates an account
2. **Invite user** - Invite users to join your platform
3. **Magic link** - One-time login link via email
4. **Change email address** - Verify new email address
5. **Reset password** - Password recovery flow
6. **Reauthentication** - Re-verify identity for sensitive actions

## Setup Steps

### Step 1: Enable Confirm Sign Up Flow

Since we're auto-confirming emails on signup (`email_confirm: true`), users won't see the confirmation email. However, you can still customize the welcome email.

**If you want email confirmation (recommended for security):**

1. Go to **Supabase Dashboard** → **Authentication** → **Policies**
2. Toggle **Confirm sign up** to **Enabled**
3. Update the signup API to use `email_confirm: false`
4. Users will receive confirmation emails

### Step 2: Customize Email Templates

1. Go to **Supabase Dashboard**
2. Click **Authentication** → **Email Templates**
3. Select each template type to customize:

#### Example: Confirm Sign Up Template

```html
<h2>Welcome to AnonymikeTech Chatbots Platform!</h2>
<p>Thank you for signing up. Please confirm your email address to get started.</p>
<p>
  <a href="{{ .ConfirmationURL }}" style="background-color: #00ff00; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
    Confirm Email Address
  </a>
</p>
<p>Or paste this link in your browser: {{ .ConfirmationURL }}</p>
<p>If you didn't create this account, you can ignore this email.</p>
```

#### Example: Reset Password Template

```html
<h2>Reset Your Password</h2>
<p>You requested to reset your password. Click the link below to create a new password.</p>
<p>
  <a href="{{ .PasswordRecoveryURL }}" style="background-color: #00ff00; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
    Reset Password
  </a>
</p>
<p>Or paste this link in your browser: {{ .PasswordRecoveryURL }}</p>
<p>This link expires in 24 hours. If you didn't request this, you can ignore this email.</p>
```

#### Example: Magic Link Template

```html
<h2>Your Magic Sign-In Link</h2>
<p>Click the link below to sign in to your account:</p>
<p>
  <a href="{{ .ConfirmationURL }}" style="background-color: #00ff00; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
    Sign In to AnonymikeTech
  </a>
</p>
<p>Or paste this link: {{ .ConfirmationURL }}</p>
<p>This link expires in 24 hours and can only be used once.</p>
```

### Step 3: Configure Email Provider

Supabase uses Auth0 for emails by default, but you should configure your own email provider for production:

1. Go to **Authentication** → **Providers** → **Email**
2. Choose your email provider:
   - SendGrid
   - AWS SES
   - Mailgun
   - Custom SMTP

3. Add your credentials and verify configuration

### Step 4: Test Email Templates

1. Go to **Authentication** → **Users**
2. Create a test user
3. Check if the confirmation email arrives
4. Verify email links work correctly

## Available Template Variables

Use these variables in your email templates:

- `{{ .ConfirmationURL }}` - Email confirmation link
- `{{ .PasswordRecoveryURL }}` - Password reset link
- `{{ .InviteUrl }}` - Invite user link
- `{{ .Email }}` - User's email address
- `{{ .Token }}` - Authentication token (if needed)
- `{{ .Data }}` - Custom data (if provided)

## Current Implementation Status

Your chatbots-ai platform currently:
- ✅ Auto-confirms emails on signup (users can login immediately)
- ✅ Has functional authentication API
- ⚠️ Uses Supabase default email provider (fine for development)
- ❌ No custom email templates configured yet

## Next Steps for Production

1. **Enable Email Confirmation** (if desired for security)
2. **Configure Custom Email Provider** (SendGrid recommended)
3. **Customize Email Templates** with your brand/styling
4. **Setup Password Reset Flow** in frontend
5. **Add Reauthentication** for sensitive operations
6. **Test all email flows** before deploying

## Troubleshooting

**Issue: Users not receiving emails**
- Check Supabase Email Logs in Authentication settings
- Verify email provider credentials
- Check spam/junk folder
- Ensure sender email is configured

**Issue: Email links not working**
- Verify your site URL in Supabase settings
- Check that authentication redirect URLs are configured
- Ensure email template has correct variables ({{ .ConfirmationURL }})

**Issue: Wrong sender address**
- Update email provider configuration
- Change "From" address in template settings
- Verify email domain/sender is authenticated with provider

## References

- [Supabase Email Templates Docs](https://supabase.com/docs/guides/auth/email-templates)
- [SendGrid Setup Guide](https://supabase.com/docs/guides/integrations/sendgrid)
- [Email Customization Examples](https://supabase.com/docs/guides/auth/auth-email-templates)
