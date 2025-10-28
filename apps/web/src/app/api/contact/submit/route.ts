/**
 * Contact Form Submission API
 * Handles contact form submissions and stores in database
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import {
  sendContactFormNotification,
  sendContactFormConfirmation,
} from '@/lib/email/client';

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;

    // Save to database
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        subject: subject || 'General Inquiry',
        message,
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving contact submission:', error);
      return NextResponse.json(
        { error: 'Failed to submit contact form' },
        { status: 500 }
      );
    }

    // Send notification email to admin
    await sendContactFormNotification({
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
      submissionId: data.id,
    });

    // Send confirmation email to user
    await sendContactFormConfirmation({
      to: email,
      name,
      message,
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!',
      id: data.id,
    });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
