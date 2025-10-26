import { createSupabaseClient } from '../_shared/supabase.ts'
import { successResponse, errorResponse, handleOptions } from '../_shared/responses.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleOptions()
  }

  try {
    const supabase = createSupabaseClient(req)
    const url = new URL(req.url)

    const days = parseInt(url.searchParams.get('days') || '7')
    const date = url.searchParams.get('date')

    // Get specific date forecast
    if (date) {
      const { data, error } = await supabase
        .from('aurora_forecasts')
        .select('*')
        .eq('forecast_date', date)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return successResponse(data)
    }

    // Get upcoming forecasts
    const { data, error } = await supabase
      .from('aurora_forecasts')
      .select('*')
      .gte('forecast_date', new Date().toISOString().split('T')[0])
      .eq('is_active', true)
      .order('forecast_date', { ascending: true })
      .limit(days)

    if (error) throw error

    return successResponse(data)
  } catch (error) {
    console.error('Error fetching forecasts:', error)
    return errorResponse(error.message, 500)
  }
})
