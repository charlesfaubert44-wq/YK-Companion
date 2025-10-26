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
    const { submission_id } = body

    if (!submission_id) {
      return errorResponse('Missing submission_id', 400)
    }

    if (req.method === 'POST') {
      // Add like
      const { data, error } = await supabase
        .from('knowledge_likes')
        .insert({
          submission_id,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          return errorResponse('Already liked', 400)
        }
        throw error
      }

      return successResponse({ liked: true, data })
    } else if (req.method === 'DELETE') {
      // Remove like
      const { error } = await supabase
        .from('knowledge_likes')
        .delete()
        .eq('submission_id', submission_id)
        .eq('user_id', user.id)

      if (error) throw error

      return successResponse({ liked: false })
    } else {
      return errorResponse('Method not allowed', 405)
    }
  } catch (error) {
    console.error('Error toggling knowledge like:', error)
    return errorResponse(error.message, 500)
  }
})
