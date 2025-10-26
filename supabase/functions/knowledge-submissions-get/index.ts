import { createSupabaseClient } from '../_shared/supabase.ts'
import { successResponse, errorResponse, handleOptions } from '../_shared/responses.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleOptions()
  }

  try {
    const supabase = createSupabaseClient(req)
    const url = new URL(req.url)

    const submissionId = url.searchParams.get('id')
    const categoryId = url.searchParams.get('category_id')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    const approved = url.searchParams.get('approved')

    // Get single submission
    if (submissionId) {
      const { data, error } = await supabase
        .from('knowledge_submissions')
        .select(
          `
          *,
          category:category_id (
            id,
            name,
            icon,
            color
          ),
          user:user_id (
            id,
            full_name
          )
        `
        )
        .eq('id', submissionId)
        .single()

      if (error) throw error
      return successResponse(data)
    }

    // Get multiple submissions with filters
    let query = supabase
      .from('knowledge_submissions')
      .select(
        `
        *,
        category:category_id (
          id,
          name,
          icon,
          color
        ),
        user:user_id (
          id,
          full_name
        )
      `
      )
      .order('created_at', { ascending: false })

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (approved !== null && approved !== undefined) {
      query = query.eq('is_approved', approved === 'true')
    }

    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) throw error

    return successResponse(data)
  } catch (error) {
    console.error('Error fetching knowledge submissions:', error)
    return errorResponse(error.message, 500)
  }
})
