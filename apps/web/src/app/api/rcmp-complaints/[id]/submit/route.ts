/**
 * RCMP Complaint Submission API
 * Submit complaint and email to RCMP detachment
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

// Lazy initialization - only create when needed
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(apiKey);
}

// POST - Submit complaint to RCMP via email
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const complaintId = params.id;

    // Fetch complaint
    const { data: complaint, error: fetchError } = await supabase
      .from('rcmp_complaints')
      .select('*')
      .eq('id', complaintId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    if (complaint.status === 'submitted') {
      return NextResponse.json(
        { error: 'This complaint has already been submitted' },
        { status: 400 }
      );
    }

    // Generate formatted complaint email
    const emailBody = generateComplaintEmail(complaint);

    // Send email to RCMP
    try {
      const resend = getResendClient();
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: 'YK Buddy Complaints <complaints@ykbuddy.com>',
        to: complaint.rcmp_email || 'yellowknife@rcmp-grc.gc.ca',
        subject: `Formal Complaint: ${complaint.incident_type.replace('_', ' ').toUpperCase()} - ${new Date(complaint.incident_date).toLocaleDateString()}`,
        html: emailBody,
        replyTo: complaint.complainant_email || undefined,
      });

      if (emailError) {
        console.error('Error sending email to RCMP:', emailError);
        return NextResponse.json({ error: 'Failed to send email to RCMP' }, { status: 500 });
      }

      // Update complaint status
      const { data: updatedComplaint, error: updateError } = await supabase
        .from('rcmp_complaints')
        .update({
          status: 'submitted',
          email_sent_to_rcmp: true,
          email_sent_at: new Date().toISOString(),
        })
        .eq('id', complaintId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating complaint:', updateError);
      }

      return NextResponse.json({
        complaint: updatedComplaint,
        message: 'Complaint submitted successfully to RCMP Yellowknife Detachment',
        email_id: emailData?.id,
      });
    } catch (emailError: any) {
      console.error('Email sending error:', emailError);
      return NextResponse.json({ error: 'Failed to send complaint email' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Complaint submission error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

function generateComplaintEmail(complaint: any): string {
  const incidentDate = new Date(complaint.incident_date).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #003366;
          color: white;
          padding: 20px;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 20px;
          border: 1px solid #ddd;
        }
        .section {
          margin-bottom: 20px;
        }
        .label {
          font-weight: bold;
          color: #003366;
        }
        .footer {
          margin-top: 20px;
          padding: 15px;
          background-color: #f0f0f0;
          border-radius: 0 0 5px 5px;
          font-size: 0.9em;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Formal Police Complaint</h1>
          <p>Submitted via YK Buddy Community Portal</p>
        </div>

        <div class="content">
          <div class="section">
            <h2>Incident Information</h2>
            <p><span class="label">Type of Incident:</span> ${complaint.incident_type.replace('_', ' ').toUpperCase()}</p>
            <p><span class="label">Date of Incident:</span> ${incidentDate}</p>
            ${complaint.incident_time ? `<p><span class="label">Time of Incident:</span> ${complaint.incident_time}</p>` : ''}
            <p><span class="label">Location:</span> ${complaint.location}</p>
          </div>

          <div class="section">
            <h2>Incident Description</h2>
            <p>${complaint.description}</p>
          </div>

          ${
            complaint.suspect_description
              ? `
          <div class="section">
            <h2>Suspect Description</h2>
            <p>${complaint.suspect_description}</p>
          </div>
          `
              : ''
          }

          ${
            complaint.vehicle_description
              ? `
          <div class="section">
            <h2>Vehicle Description</h2>
            <p>${complaint.vehicle_description}</p>
          </div>
          `
              : ''
          }

          ${
            complaint.witness_info
              ? `
          <div class="section">
            <h2>Witness Information</h2>
            <p>${complaint.witness_info}</p>
          </div>
          `
              : ''
          }

          ${
            !complaint.is_anonymous && complaint.complainant_name
              ? `
          <div class="section">
            <h2>Complainant Contact Information</h2>
            ${complaint.complainant_name ? `<p><span class="label">Name:</span> ${complaint.complainant_name}</p>` : ''}
            ${complaint.complainant_phone ? `<p><span class="label">Phone:</span> ${complaint.complainant_phone}</p>` : ''}
            ${complaint.complainant_email ? `<p><span class="label">Email:</span> ${complaint.complainant_email}</p>` : ''}
          </div>
          `
              : `
          <div class="section">
            <p><em>This complaint has been submitted anonymously.</em></p>
          </div>
          `
          }

          ${
            complaint.evidence_images?.length > 0
              ? `
          <div class="section">
            <h2>Evidence Attached</h2>
            <p><span class="label">Number of images:</span> ${complaint.evidence_images.length}</p>
            <p><span class="label">Image URLs:</span></p>
            <ul>
              ${complaint.evidence_images.map((url: string) => `<li><a href="${url}">${url}</a></li>`).join('')}
            </ul>
          </div>
          `
              : ''
          }
        </div>

        <div class="footer">
          <p><strong>Reference ID:</strong> ${complaint.id}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-CA', { timeZone: 'America/Edmonton' })}</p>
          <p>This complaint was submitted through the YK Buddy community platform.</p>
          <p>For questions about this system, contact: support@ykbuddy.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
