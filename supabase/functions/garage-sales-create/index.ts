import { createSupabaseClient } from '../_shared/supabase.ts'
import { successResponse, errorResponse, handleOptions } from '../_shared/responses.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleOptions()
  }

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405)
  }

  try {
    const supabase = createSupabaseClient(req)

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return errorResponse('Unauthorized', 401)
    }

    const body = await req.json()

    // Validate required fields
    const required = ['title', 'address', 'sale_date', 'latitude', 'longitude']
    for (const field of required) {
      if (!body[field]) {
        return errorResponse(`Missing required field: ${field}`, 400)
      }
    }

    // Create the garage sale
    const { data, error } = await supabase
      .from('garage_sales')
      .insert({
        user_id: user.id,
        title: body.title,
        description: body.description || null,
        address: body.address,
        sale_date: body.sale_date,
        start_time: body.start_time || null,
        end_time: body.end_time || null,
        latitude: body.latitude,
        longitude: body.longitude,
        contact_email: body.contact_email || null,
        contact_phone: body.contact_phone || null,
        items_preview: body.items_preview || null,
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error

    return successResponse(data, 201)
  } catch (error) {
    console.error('Error creating garage sale:', error)
    return errorResponse(error.message, 500)
  }
})
