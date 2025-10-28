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

    // Validate required fields
    const required = ['category_id', 'title', 'content']
    for (const field of required) {
      if (!body[field]) {
        return errorResponse(`Missing required field: ${field}`, 400)
      }
    }

    // Create knowledge submission
    const { data, error } = await supabase
      .from('knowledge_submissions')
      .insert({
        user_id: user.id,
        category_id: body.category_id,
        title: body.title,
        content: body.content,
        tags: body.tags || [],
        source_url: body.source_url || null,
        is_approved: false, // Requires admin approval
      })
      .select(
        `
        *,
        category:category_id (
          id,
          name,
          icon,
          color
        )
      `
      )
      .single()

    if (error) throw error

    return successResponse(data, 201)
  } catch (error) {
    console.error('Error creating knowledge submission:', error)
    return errorResponse(error.message, 500)
  }
})
