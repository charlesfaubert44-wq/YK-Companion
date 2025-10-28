import { createSupabaseClient } from '../_shared/supabase.ts'
import { successResponse, errorResponse, handleOptions } from '../_shared/responses.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleOptions()
  }

  if (req.method !== 'DELETE') {
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

    const url = new URL(req.url)
    const id = url.searchParams.get('id')

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
      return errorResponse('Forbidden: You can only delete your own garage sales', 403)
    }

    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from('garage_sales')
      .update({ is_active: false })
      .eq('id', id)

    if (error) throw error

    return successResponse({ message: 'Garage sale deleted successfully' })
  } catch (error) {
    console.error('Error deleting garage sale:', error)
    return errorResponse(error.message, 500)
  }
})
