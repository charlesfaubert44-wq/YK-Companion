import { createSupabaseClient } from '../_shared/supabase.ts'
import { successResponse, errorResponse, handleOptions } from '../_shared/responses.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleOptions()
  }

  if (req.method !== 'DELETE') {
    return errorResponse('Method not allowed', 405)
  }

  try {
    const supabase = createSupabaseClient(req)

    const body = await req.json()
    const { endpoint } = body

    if (!endpoint) {
      return errorResponse('Missing endpoint', 400)
    }

    // Delete subscription
    const { error } = await supabase
      .from('push_notification_subscriptions')
      .delete()
      .eq('endpoint', endpoint)

    if (error) throw error

    return successResponse({ message: 'Successfully unsubscribed from push notifications' })
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error)
    return errorResponse(error.message, 500)
  }
})
