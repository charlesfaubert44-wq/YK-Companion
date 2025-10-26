import { createSupabaseClient } from '../_shared/supabase.ts'
import { successResponse, errorResponse, handleOptions } from '../_shared/responses.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleOptions()
  }

  try {
    const supabase = createSupabaseClient(req)
    const url = new URL(req.url)
    const saleId = url.searchParams.get('id')

    // Get single garage sale by ID
    if (saleId) {
      const { data, error } = await supabase
        .from('garage_sales')
        .select('*')
        .eq('id', saleId)
        .single()

      if (error) throw error
      return successResponse(data)
    }

    // Get all garage sales with optional filters
    const upcoming = url.searchParams.get('upcoming') === 'true'
    const limit = parseInt(url.searchParams.get('limit') || '100')

    let query = supabase
      .from('garage_sales')
      .select('*')
      .order('sale_date', { ascending: true })

    // Filter for upcoming sales only
    if (upcoming) {
      query = query.gte('sale_date', new Date().toISOString())
    }

    query = query.limit(limit)

    const { data, error } = await query

    if (error) throw error
    return successResponse(data)
  } catch (error) {
    console.error('Error:', error)
    return errorResponse(error.message, 500)
  }
})
