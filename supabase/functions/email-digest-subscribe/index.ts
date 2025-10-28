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
    const { email, frequency } = body

    if (!email) {
      return errorResponse('Missing email', 400)
    }

    const validFrequencies = ['daily', 'weekly', 'monthly']
    if (frequency && !validFrequencies.includes(frequency)) {
      return errorResponse('Invalid frequency. Must be daily, weekly, or monthly', 400)
    }

    // Upsert subscription
    const { data, error } = await supabase
      .from('email_digest_subscriptions')
      .upsert(
        {
          user_id: user.id,
          email,
          frequency: frequency || 'weekly',
          is_active: true,
        },
        {
          onConflict: 'user_id',
        }
      )
      .select()
      .single()

    if (error) throw error

    return successResponse(data, 201)
  } catch (error) {
    console.error('Error subscribing to email digest:', error)
    return errorResponse(error.message, 500)
  }
})
