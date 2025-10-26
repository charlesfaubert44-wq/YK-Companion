import { createAdminClient } from '../_shared/supabase.ts'
import { successResponse, errorResponse, handleOptions } from '../_shared/responses.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleOptions()
  }

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405)
  }

  try {
    const supabase = createAdminClient()

    const body = await req.json()
    const { token } = body

    if (!token) {
      return errorResponse('Missing unsubscribe token', 400)
    }

    // Update subscription to inactive
    const { data, error } = await supabase
      .from('email_digest_subscriptions')
      .update({ is_active: false })
      .eq('unsubscribe_token', token)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return errorResponse('Invalid or expired unsubscribe token', 404)
      }
      throw error
    }

    return successResponse({ message: 'Successfully unsubscribed from email digest', data })
  } catch (error) {
    console.error('Error unsubscribing from email digest:', error)
    return errorResponse(error.message, 500)
  }
})
