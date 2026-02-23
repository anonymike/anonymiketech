# Formspree Integration - Contact Form

## Overview
The contact form has been integrated with Formspree using the React library (`@formspree/react`) to handle email submissions securely.

## Configuration

**Endpoint:** `https://formspree.io/f/mykdbpzy`

**React Hook:** `useForm("mykdbpzy")`

## Implementation Details

### Contact Form Component (`ContactForm`)
Located in `/app/contact/page.tsx`

**Features:**
- Real-time form validation using Formspree's `ValidationError` component
- Loading state while form is submitting (button disabled)
- Success message displayed after successful submission
- All Framer Motion animations preserved
- Error handling for each field (name, email, phone, subject, message)

### Form Fields

| Field | Type | Required | Input Name |
|-------|------|----------|-----------|
| Full Name | text | Yes | `name` |
| Email Address | email | Yes | `email` |
| Phone Number | tel | No | `phone` |
| Subject | text | Yes | `subject` |
| Message | textarea | Yes | `message` |

### Form States

1. **Initial State:** Form ready for input
2. **Submitting State:** Button disabled, shows "Sending..." text
3. **Success State:** Green success message displays
4. **Error State:** Validation errors show below each field

## Installation

If not already installed, run:

```bash
npm install @formspree/react
```

## How It Works

1. User fills out the contact form
2. Click "Send Message" button
3. Formspree validates and sends the email to your configured inbox
4. Success message appears: "Message sent successfully!"
5. Form remains on page for additional submissions

## Email Inbox

All submissions are sent to the email address configured in your Formspree account for project `mykdbpzy`.

## Customization

To change the Formspree endpoint:
1. Update the project key in the `useForm()` hook
2. Update the form ID if needed

Example:
```typescript
const [state, handleSubmit] = useForm("YOUR_NEW_PROJECT_ID")
```

## Styling

- Form uses the hacker terminal aesthetic with green accent colors
- Animations fade and slide in sequentially
- Success message has green accent styling to match the design
- Error messages display in red text below their respective fields

## Notes

- Phone number is optional
- All other fields are required for submission
- Formspree handles spam filtering automatically
- Form validation happens both client-side and server-side
