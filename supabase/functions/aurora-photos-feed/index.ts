import { createSupabaseClient } from '../_shared/supabase.ts'
import { successResponse, errorResponse, handleOptions } from '../_shared/responses.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleOptions()
  }

  try {
    const supabase = createSupabaseClient(req)
    const url = new URL(req.url)

    const limit = parseInt(url.searchParams.get('limit') || '20')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    const featured = url.searchParams.get('featured') === 'true'
    const challengeId = url.searchParams.get('challenge_id')
    const userId = url.searchParams.get('user_id')

    let query = supabase
      .from('aurora_photos')
      .select(
        `
        *,
        profiles:user_id (
          id,
          full_name,
          avatar_url
        )
      `
      )
      .eq('is_approved', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (featured) {
      query = query.eq('is_featured', true)
    }

    if (challengeId) {
      query = query.eq('challenge_id', challengeId)
    }

    if (userId) {
      query = query.eq('user_id', userId)
    }

    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) throw error

    return successResponse(data)
  } catch (error) {
    console.error('Error fetching photo feed:', error)
    return errorResponse(error.message, 500)
  }
})
