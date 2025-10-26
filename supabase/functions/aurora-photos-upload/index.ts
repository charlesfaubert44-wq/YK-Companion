import { createSupabaseClient } from '../_shared/supabase.ts'
import { successResponse, errorResponse, handleOptions } from '../_shared/responses.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleOptions()
  }

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405)
  }

  try {
    const supabase = createSupabaseClient(req)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return errorResponse('Unauthorized', 401)
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const caption = formData.get('caption') as string
    const location = formData.get('location') as string
    const latitude = formData.get('latitude') as string
    const longitude = formData.get('longitude') as string
    const takenAt = formData.get('taken_at') as string
    const cameraSettings = formData.get('camera_settings') as string
    const challengeId = formData.get('challenge_id') as string

    if (!file) {
      return errorResponse('Missing file', 400)
    }

    // Upload file to Supabase Storage
    const fileName = `${user.id}/${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('aurora-photos')
      .upload(fileName, file, {
        contentType: file.type,
        cacheControl: '3600',
      })

    if (uploadError) throw uploadError

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('aurora-photos').getPublicUrl(fileName)

    // Create database entry
    const { data, error } = await supabase
      .from('aurora_photos')
      .insert({
        user_id: user.id,
        photo_url: publicUrl,
        caption: caption || null,
        location: location || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        taken_at: takenAt || null,
        camera_settings: cameraSettings ? JSON.parse(cameraSettings) : null,
        challenge_id: challengeId || null,
        is_approved: false, // Requires admin approval
      })
      .select()
      .single()

    if (error) throw error

    return successResponse(data, 201)
  } catch (error) {
    console.error('Error uploading photo:', error)
    return errorResponse(error.message, 500)
  }
})
