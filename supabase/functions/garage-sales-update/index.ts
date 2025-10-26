import { createSupabaseClient } from '../_shared/supabase.ts'
import { successResponse, errorResponse, handleOptions } from '../_shared/responses.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleOptions()
  }

  if (req.method !== 'PUT' && req.method !== 'PATCH') {
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
    const { id, ...updates } = body

    if (!id) {
      return errorResponse('Missing garage sale ID', 400)
    }

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('garage_sales')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    if (existing.user_id !== user.id) {
      return errorResponse('Forbidden: You can only update your own garage sales', 403)
    }

    // Update the garage sale
    const { data, error } = await supabase
      .from('garage_sales')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return successResponse(data)
  } catch (error) {
    console.error('Error updating garage sale:', error)
    return errorResponse(error.message, 500)
  }
})
