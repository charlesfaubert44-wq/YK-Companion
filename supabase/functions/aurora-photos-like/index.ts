import { createSupabaseClient } from '../_shared/supabase.ts'
import { successResponse, errorResponse, handleOptions } from '../_shared/responses.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleOptions()
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

    const body = await req.json()
    const { photo_id } = body

    if (!photo_id) {
      return errorResponse('Missing photo_id', 400)
    }

    if (req.method === 'POST') {
      // Like a photo
      const { data, error } = await supabase
        .from('aurora_photo_likes')
        .insert({
          photo_id,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) {
        // Already liked
        if (error.code === '23505') {
          return errorResponse('Photo already liked', 400)
        }
        throw error
      }

      return successResponse({ liked: true, data })
    } else if (req.method === 'DELETE') {
      // Unlike a photo
      const { error } = await supabase
        .from('aurora_photo_likes')
        .delete()
        .eq('photo_id', photo_id)
        .eq('user_id', user.id)

      if (error) throw error

      return successResponse({ liked: false })
    } else {
      return errorResponse('Method not allowed', 405)
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return errorResponse(error.message, 500)
  }
})
