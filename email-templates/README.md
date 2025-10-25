# Email Templates

Custom email templates for YK Buddy featuring a stunning Aurora theme with colorful gradients, interactive elements, and mobile-responsive design.

## Available Templates

### 1. Signup Confirmation Email (Enhanced)
- **HTML**: `confirm-signup.html` - Fully redesigned with premium features
- **Plain Text**: `confirm-signup.txt` - Enhanced with visual ASCII styling

#### Key Features:
- **Stunning Header**: Aurora wave SVG background with glowing logo and gradient brand name
- **Mobile-Responsive**: Optimized layouts for all screen sizes with media queries
- **Colorful Design**: Rich Aurora color palette (cyan, purple, green gradients)
- **Interactive Elements**: Hover effects on buttons and feature cards (where supported)
- **Feature Cards**: 4 beautifully designed cards with color-coded icons and descriptions
- **Enhanced CTA**: Gradient-bordered button with glow effects
- **Professional Footer**: Multi-layer footer with community messaging
- **Accessibility**: Preheader text, semantic HTML, high contrast ratios
- **Email Client Support**: Outlook-specific fixes, inline CSS, table-based layout

## Template Variables

These templates use the following variables that are automatically provided by Supabase Auth:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{ .ConfirmationURL }}` | Email confirmation link | `https://your-app.com/auth/confirm?token=...` |
| `{{ .Email }}` | User's email address | `user@example.com` |
| `{{ .UserMetadata.full_name }}` | User's full name | `John Doe` |

## Implementation with Supabase

### Option 1: Using Supabase Dashboard (Recommended for Quick Setup)

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Authentication** > **Email Templates**
3. Select **Confirm signup** template
4. Copy the content from `confirm-signup.html`
5. Paste it into the template editor
6. Save changes

### Option 2: Using Supabase CLI

1. Create a `supabase/templates/` directory in your project:
   ```bash
   mkdir -p supabase/templates
   ```

2. Copy templates to Supabase templates directory:
   ```bash
   cp email-templates/confirm-signup.html supabase/templates/
   cp email-templates/confirm-signup.txt supabase/templates/
   ```

3. Update your `supabase/config.toml`:
   ```toml
   [auth.email.template.confirmation]
   subject = "Confirm Your YK Buddy Account"
   content_path = "./supabase/templates/confirm-signup.html"
   ```

4. Deploy templates:
   ```bash
   supabase db push
   ```

### Option 3: Using Custom Email Service (Advanced)

If you want to use a custom email service like Resend, SendGrid, or Mailgun:

1. Disable Supabase email templates in the dashboard
2. Set up webhook for auth events
3. Send emails from your backend using these templates

Example with Resend:

```typescript
import { Resend } from 'resend';
import * as fs from 'fs';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendConfirmationEmail(email: string, confirmationUrl: string, fullName: string) {
  const template = fs.readFileSync('./email-templates/confirm-signup.html', 'utf-8');

  const html = template
    .replace(/\{\{ \.ConfirmationURL \}\}/g, confirmationUrl)
    .replace(/\{\{ \.Email \}\}/g, email)
    .replace(/\{\{ \.UserMetadata\.full_name \}\}/g, fullName);

  await resend.emails.send({
    from: 'YK Buddy <noreply@ykbuddy.com>',
    to: email,
    subject: 'Confirm Your YK Buddy Account',
    html: html,
  });
}
```

## Testing Templates

### Quick Preview (Recommended)
Open `preview.html` in your browser to see the email with sample data already filled in:

```bash
# Open in default browser (macOS)
open email-templates/preview.html

# Open in default browser (Linux)
xdg-open email-templates/preview.html

# Or just double-click the file in your file explorer
```

This preview file includes sample data so you can immediately see how the email will look!

### Test in Browser
Open `confirm-signup.html` in a browser and manually replace template variables with test data:

```html
<!-- Replace -->
{{ .ConfirmationURL }}
<!-- With -->
https://dev.ykbuddy.com/auth/confirm?token=test123

<!-- Replace -->
{{ .Email }}
<!-- With -->
test@example.com

<!-- Replace -->
{{ .UserMetadata.full_name }}
<!-- With -->
Test User
```

### Test Email Rendering

Use services like:
- [Litmus](https://litmus.com) - Comprehensive email testing
- [Email on Acid](https://www.emailonacid.com) - Multi-client testing
- [Mailtrap](https://mailtrap.io) - Email sandbox testing
- [Preview emails in Gmail, Outlook, etc.](https://www.mail-tester.com)

## Customization

### Colors

The template uses YK Buddy's Aurora color palette:

```css
/* Aurora Blues */
#0eb9d4, #22d3ee

/* Aurora Purples */
#8b5cf6, #a855f7

/* Aurora Greens */
#10b981, #34d399

/* Dark Backgrounds */
#0f172a, #1e293b, #1a1f2e

/* Text Colors */
#ffffff (white)
#e2e8f0, #cbd5e1, #94a3b8, #64748b (grays)
```

### Typography

- Font family: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)
- Heading: 28px, bold, gradient text
- Body: 16px, line-height 1.6
- Small text: 14px, 12px for footer

## Troubleshooting

### Template variables not rendering

If variables like `{{ .Email }}` appear as literal text:
- Check that you're using the correct syntax for your email provider
- Verify the variables are supported by your provider
- Test with hardcoded values first

### Styling issues in email clients

- Gmail strips `<style>` tags - always use inline styles
- Outlook has limited CSS support - test thoroughly
- Use table-based layouts for better compatibility
- Avoid `position: absolute`, `float`, and complex CSS

### Images not loading

- Host images on a CDN or web server
- Use absolute URLs, not relative paths
- Include alt text for accessibility
- Optimize image sizes for email

## Future Templates

Consider creating templates for:
- Password reset
- Email change confirmation
- Magic link login
- Welcome email (post-confirmation)
- Aurora alert notifications
- Weekly digest emails
- Password changed notification

## Resources

- [Supabase Email Templates Docs](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Email HTML Best Practices](https://www.campaignmonitor.com/css/)
- [Can I Email](https://www.caniemail.com/) - CSS support in email clients
