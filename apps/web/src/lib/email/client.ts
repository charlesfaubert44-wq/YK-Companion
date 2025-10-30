/**
 * Email Service Client
 * Handles sending emails via Resend
 */

import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not set. Email functionality will be disabled.');
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const emailConfig = {
  from: 'YK Buddy <noreply@ykbuddy.com>',
  replyTo: 'support@ykbuddy.com',
  adminEmail: 'admin@ykbuddy.com',
};

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

/**
 * Send an email
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo = emailConfig.replyTo,
}: SendEmailParams) {
  if (!resend) {
    console.warn('Email not sent - Resend not configured:', subject);
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: emailConfig.from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      replyTo,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }

    console.log('Email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error: any) {
    console.error('Email send exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmation({
  to,
  name,
  amount,
  sponsorTier,
  billingPeriod,
  paymentIntentId,
}: {
  to: string;
  name: string;
  amount: number;
  sponsorTier: string;
  billingPeriod: string;
  paymentIntentId: string;
}) {
  const subject = `Payment Confirmation - YK Buddy Sponsorship`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-label { font-weight: bold; color: #6b7280; }
    .detail-value { color: #111827; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 Thank You for Your Support!</h1>
  </div>
  <div class="content">
    <p>Hi ${name},</p>

    <p>Thank you for becoming a <strong>${sponsorTier}</strong> sponsor of YK Buddy! Your support helps us continue to provide valuable resources and information about Yellowknife.</p>

    <div class="details">
      <h3>Payment Details</h3>
      <div class="detail-row">
        <span class="detail-label">Amount Paid:</span>
        <span class="detail-value">$${(amount / 100).toFixed(2)} CAD</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Sponsor Tier:</span>
        <span class="detail-value">${sponsorTier}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Billing Period:</span>
        <span class="detail-value">${billingPeriod}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Transaction ID:</span>
        <span class="detail-value">${paymentIntentId}</span>
      </div>
    </div>

    <h3>What's Next?</h3>
    <ul>
      <li>Your sponsorship is now active</li>
      <li>You'll receive a receipt for your records via email</li>
      <li>Our team will reach out within 24 hours to set up your sponsor profile</li>
      <li>Your business will be featured prominently on YK Buddy</li>
    </ul>

    <div style="text-align: center;">
      <a href="https://ykbuddy.com/sponsor-dashboard" class="button">View Your Dashboard</a>
    </div>

    <p>If you have any questions, please don't hesitate to contact us at <a href="mailto:support@ykbuddy.com">support@ykbuddy.com</a>.</p>

    <p>Thanks again for supporting YK Buddy!</p>

    <p><strong>The YK Buddy Team</strong></p>
  </div>
  <div class="footer">
    <p>YK Buddy - Your Guide to Yellowknife</p>
    <p>This email was sent to ${to}</p>
  </div>
</body>
</html>
  `;

  const text = `
Thank You for Your Support!

Hi ${name},

Thank you for becoming a ${sponsorTier} sponsor of YK Buddy! Your support helps us continue to provide valuable resources and information about Yellowknife.

Payment Details:
- Amount Paid: $${(amount / 100).toFixed(2)} CAD
- Sponsor Tier: ${sponsorTier}
- Billing Period: ${billingPeriod}
- Transaction ID: ${paymentIntentId}

What's Next?
- Your sponsorship is now active
- You'll receive a receipt for your records via email
- Our team will reach out within 24 hours to set up your sponsor profile
- Your business will be featured prominently on YK Buddy

If you have any questions, please contact us at support@ykbuddy.com.

Thanks again for supporting YK Buddy!

The YK Buddy Team
  `;

  return sendEmail({ to, subject, html, text });
}

/**
 * Send contact form notification to admin
 */
export async function sendContactFormNotification({
  name,
  email,
  subject: userSubject,
  message,
  submissionId,
}: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  submissionId: string;
}) {
  const subject = `New Contact Form Submission${userSubject ? `: ${userSubject}` : ''}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .message-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
    .detail { padding: 8px 0; }
    .label { font-weight: bold; color: #6b7280; }
    .button { display: inline-block; background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h2>📧 New Contact Form Submission</h2>
  </div>
  <div class="content">
    <div class="detail">
      <span class="label">From:</span> ${name} (${email})
    </div>
    ${userSubject ? `<div class="detail"><span class="label">Subject:</span> ${userSubject}</div>` : ''}
    <div class="detail">
      <span class="label">Submission ID:</span> ${submissionId}
    </div>

    <div class="message-box">
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    </div>

    <div style="text-align: center;">
      <a href="https://ykbuddy.com/admin/contact-submissions/${submissionId}" class="button">View in Admin Panel</a>
    </div>

    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
      <strong>Quick Actions:</strong><br>
      Reply directly to this email to respond to ${name}, or manage this submission in the admin panel.
    </p>
  </div>
</body>
</html>
  `;

  const text = `
New Contact Form Submission

From: ${name} (${email})
${userSubject ? `Subject: ${userSubject}` : ''}
Submission ID: ${submissionId}

Message:
${message}

View in Admin Panel: https://ykbuddy.com/admin/contact-submissions/${submissionId}

Reply directly to this email to respond to ${name}.
  `;

  return sendEmail({
    to: emailConfig.adminEmail,
    subject,
    html,
    text,
    replyTo: email,
  });
}

/**
 * Send contact form confirmation to user
 */
export async function sendContactFormConfirmation({
  to,
  name,
  message,
}: {
  to: string;
  name: string;
  message: string;
}) {
  const subject = `We received your message - YK Buddy`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="header">
    <h1>✅ Message Received</h1>
  </div>
  <div class="content">
    <p>Hi ${name},</p>

    <p>Thank you for reaching out to YK Buddy! We've received your message and our team will get back to you as soon as possible, typically within 24-48 hours.</p>

    <div class="message-box">
      <h3>Your Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    </div>

    <p>In the meantime, feel free to explore:</p>
    <ul>
      <li><a href="https://ykbuddy.com/events">Upcoming Events</a></li>
      <li><a href="https://ykbuddy.com/aurora">Aurora Forecast</a></li>
      <li><a href="https://ykbuddy.com/garage-sales">Garage Sales</a></li>
      <li><a href="https://ykbuddy.com/business-directory">Business Directory</a></li>
    </ul>

    <p>If your inquiry is urgent, you can also reach us at <a href="mailto:support@ykbuddy.com">support@ykbuddy.com</a>.</p>

    <p><strong>The YK Buddy Team</strong></p>
  </div>
  <div class="footer">
    <p>YK Buddy - Your Guide to Yellowknife</p>
    <p>This email was sent to ${to}</p>
  </div>
</body>
</html>
  `;

  const text = `
Message Received

Hi ${name},

Thank you for reaching out to YK Buddy! We've received your message and our team will get back to you as soon as possible, typically within 24-48 hours.

Your Message:
${message}

In the meantime, feel free to explore our website at https://ykbuddy.com

If your inquiry is urgent, you can also reach us at support@ykbuddy.com.

The YK Buddy Team
  `;

  return sendEmail({ to, subject, html, text });
}

/**
 * Send payment failed notification
 */
export async function sendPaymentFailedNotification({
  to,
  name,
  amount,
  sponsorTier,
  error,
}: {
  to: string;
  name: string;
  amount: number;
  sponsorTier: string;
  error: string;
}) {
  const subject = `Payment Issue - YK Buddy Sponsorship`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .warning-box { background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>⚠️ Payment Issue</h1>
  </div>
  <div class="content">
    <p>Hi ${name},</p>

    <p>We attempted to process your payment for the <strong>${sponsorTier}</strong> sponsorship, but unfortunately it was unsuccessful.</p>

    <div class="warning-box">
      <h3>Payment Details:</h3>
      <p><strong>Amount:</strong> $${(amount / 100).toFixed(2)} CAD<br>
      <strong>Sponsor Tier:</strong> ${sponsorTier}<br>
      <strong>Issue:</strong> ${error}</p>
    </div>

    <h3>What You Can Do:</h3>
    <ul>
      <li>Check that your payment method has sufficient funds</li>
      <li>Verify your card details are correct</li>
      <li>Try a different payment method</li>
      <li>Contact your bank if the issue persists</li>
    </ul>

    <div style="text-align: center;">
      <a href="https://ykbuddy.com/sponsor" class="button">Try Again</a>
    </div>

    <p>If you continue to experience issues, please contact us at <a href="mailto:support@ykbuddy.com">support@ykbuddy.com</a> and we'll be happy to help.</p>

    <p><strong>The YK Buddy Team</strong></p>
  </div>
</body>
</html>
  `;

  const text = `
Payment Issue

Hi ${name},

We attempted to process your payment for the ${sponsorTier} sponsorship, but unfortunately it was unsuccessful.

Payment Details:
- Amount: $${(amount / 100).toFixed(2)} CAD
- Sponsor Tier: ${sponsorTier}
- Issue: ${error}

What You Can Do:
- Check that your payment method has sufficient funds
- Verify your card details are correct
- Try a different payment method
- Contact your bank if the issue persists

Try again at: https://ykbuddy.com/sponsor

If you continue to experience issues, please contact us at support@ykbuddy.com.

The YK Buddy Team
  `;

  return sendEmail({ to, subject, html, text });
}

/**
 * Send neighborhood join request notification to moderators
 */
export async function sendNeighborhoodJoinRequest({
  moderatorEmails,
  applicantName,
  applicantEmail,
  neighborhoodName,
  requestReason,
  providedAddress,
  approvalUrl,
}: {
  moderatorEmails: string[];
  applicantName: string;
  applicantEmail: string;
  neighborhoodName: string;
  requestReason?: string;
  providedAddress?: string;
  approvalUrl: string;
}) {
  const subject = `New Neighborhood Join Request - ${neighborhoodName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .applicant-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
    .detail { padding: 8px 0; }
    .label { font-weight: bold; color: #6b7280; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px auto; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏘️ New Join Request</h1>
  </div>
  <div class="content">
    <p>A new member has requested to join <strong>${neighborhoodName}</strong>.</p>

    <div class="applicant-box">
      <h3>Applicant Information:</h3>
      <div class="detail">
        <span class="label">Name:</span> ${applicantName}
      </div>
      <div class="detail">
        <span class="label">Email:</span> ${applicantEmail}
      </div>
      ${providedAddress ? `<div class="detail"><span class="label">Address:</span> ${providedAddress}</div>` : ''}
      ${requestReason ? `<div class="detail"><span class="label">Reason:</span> ${requestReason}</div>` : ''}
    </div>

    <div style="text-align: center;">
      <a href="${approvalUrl}" class="button">Review Application</a>
    </div>

    <p>Please review this application and approve or reject it in the admin panel.</p>

    <p><strong>The YK Buddy Team</strong></p>
  </div>
  <div class="footer">
    <p>YK Buddy - Your Guide to Yellowknife</p>
  </div>
</body>
</html>
  `;

  return sendEmail({ to: moderatorEmails, subject, html });
}

/**
 * Send neighborhood join approval notification to user
 */
export async function sendNeighborhoodJoinApproval({
  to,
  userName,
  neighborhoodName,
  dashboardUrl,
}: {
  to: string;
  userName: string;
  neighborhoodName: string;
  dashboardUrl: string;
}) {
  const subject = `Welcome to ${neighborhoodName}! 🎉`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .feature-box { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; }
    .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px auto; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="header">
    <h1>✅ You're In!</h1>
  </div>
  <div class="content">
    <p>Hi ${userName},</p>

    <p>Great news! Your request to join <strong>${neighborhoodName}</strong> has been approved. Welcome to the community!</p>

    <h3>What You Can Do Now:</h3>
    <div class="feature-box">
      <strong>📣 Bulletin Board</strong> - Share help offers, recommendations, and announcements
    </div>
    <div class="feature-box">
      <strong>🚨 Security Alerts</strong> - Stay informed about local safety issues
    </div>
    <div class="feature-box">
      <strong>🏪 Local Businesses</strong> - Discover and support neighborhood businesses
    </div>
    <div class="feature-box">
      <strong>👮 RCMP Complaints</strong> - Submit formal police complaints
    </div>
    <div class="feature-box">
      <strong>🏛️ Local Politics</strong> - Discuss civic issues and community decisions
    </div>

    <div style="text-align: center;">
      <a href="${dashboardUrl}" class="button">Visit Your Neighborhood</a>
    </div>

    <p>We're excited to have you as part of our community. Let's build a stronger, more connected neighborhood together!</p>

    <p><strong>The YK Buddy Team</strong></p>
  </div>
  <div class="footer">
    <p>YK Buddy - Your Guide to Yellowknife</p>
    <p>This email was sent to ${to}</p>
  </div>
</body>
</html>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * Send neighborhood alert notification to members
 */
export async function sendNeighborhoodAlert({
  memberEmails,
  neighborhoodName,
  alertType,
  alertTitle,
  alertDescription,
  severity,
  location,
  alertUrl,
}: {
  memberEmails: string[];
  neighborhoodName: string;
  alertType: string;
  alertTitle: string;
  alertDescription: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  alertUrl: string;
}) {
  const severityColors = {
    low: '#3b82f6',
    medium: '#f59e0b',
    high: '#f97316',
    critical: '#dc2626',
  };

  const severityIcons = {
    low: '🔵',
    medium: '🟡',
    high: '🟠',
    critical: '🔴',
  };

  const subject = `${severityIcons[severity]} ${severity.toUpperCase()} Alert: ${alertTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: ${severityColors[severity]}; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .alert-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${severityColors[severity]}; }
    .button { display: inline-block; background: ${severityColors[severity]}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px auto; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${severityIcons[severity]} ${severity.toUpperCase()} Alert</h1>
    <p style="margin: 0; font-size: 14px;">${neighborhoodName}</p>
  </div>
  <div class="content">
    <div class="alert-box">
      <h2>${alertTitle}</h2>
      <p><strong>Type:</strong> ${alertType.replace('_', ' ').toUpperCase()}</p>
      ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
      <p><strong>Severity:</strong> ${severity.toUpperCase()}</p>
      <p style="margin-top: 15px;">${alertDescription}</p>
    </div>

    ${
      severity === 'critical' || severity === 'high'
        ? `
    <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; color: #dc2626;"><strong>⚠️ This is a ${severity} severity alert. Please take immediate action if necessary.</strong></p>
    </div>
    `
        : ''
    }

    <div style="text-align: center;">
      <a href="${alertUrl}" class="button">View Full Alert</a>
    </div>

    <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
      <strong>Stay Safe:</strong> If you witness suspicious activity or have additional information,
      ${severity === 'critical' || severity === 'high' ? 'call 911 immediately or ' : ''}
      share it with your neighborhood via the YK Buddy platform.
    </p>

    <p><strong>The YK Buddy Team</strong></p>
  </div>
  <div class="footer">
    <p>YK Buddy - Your Guide to Yellowknife</p>
    <p><a href="#">Unsubscribe from alerts</a></p>
  </div>
</body>
</html>
  `;

  return sendEmail({ to: memberEmails, subject, html });
}
