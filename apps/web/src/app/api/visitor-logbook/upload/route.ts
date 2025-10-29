import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, rateLimitConfigs } from '@/lib/rate-limiting';

/**
 * POST /api/visitor-logbook/upload
 * Upload a photo for visitor logbook entry
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in to upload photos.' },
        { status: 401 }
      );
    }

    // Rate limiting - 20 uploads per minute
    const rateLimit = checkRateLimit(
      request,
      rateLimitConfigs.write,
      user.id
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many uploads. Please try again later.' },
        {
          status: 429,
          headers: rateLimit.headers
        }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('photo') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type. Please upload JPG, PNG, WEBP, or HEIC images.'
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: 'File too large. Maximum size is 10MB.'
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${user.id}-${timestamp}-${randomString}.${fileExt}`;
    const filePath = `logbook/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('visitor-logbook-photos')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to upload photo. Please try again.'
        },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from('visitor-logbook-photos')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
    }, {
      headers: rateLimit.headers
    });

  } catch (error) {
    console.error('Error in visitor logbook photo upload:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while uploading the photo.'
      },
      { status: 500 }
    );
  }
}
