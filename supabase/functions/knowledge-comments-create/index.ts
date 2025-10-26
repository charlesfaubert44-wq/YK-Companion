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

    const body = await req.json()
    const { submission_id, content } = body

    if (!submission_id || !content) {
      return errorResponse('Missing submission_id or content', 400)
    }

    // Create comment
    const { data, error } = await supabase
      .from('knowledge_comments')
      .insert({
        submission_id,
        user_id: user.id,
        content,
      })
      .select(
        `
        *,
        user:user_id (
          id,
          full_name
        )
      `
      )
      .single()

    if (error) throw error

    return successResponse(data, 201)
  } catch (error) {
    console.error('Error creating comment:', error)
    return errorResponse(error.message, 500)
  }
})
