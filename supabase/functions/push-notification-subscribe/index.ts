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

    // Allow anonymous push subscriptions
    const body = await req.json()
    const { subscription, preferences } = body

    if (!subscription || !subscription.endpoint) {
      return errorResponse('Missing subscription data', 400)
    }

    // Extract push subscription keys
    const endpoint = subscription.endpoint
    const p256dhKey = subscription.keys?.p256dh
    const authKey = subscription.keys?.auth

    if (!p256dhKey || !authKey) {
      return errorResponse('Missing encryption keys', 400)
    }

    // Upsert subscription
    const { data, error } = await supabase
      .from('push_notification_subscriptions')
      .upsert(
        {
          user_id: user?.id || null,
          endpoint,
          p256dh_key: p256dhKey,
          auth_key: authKey,
          alert_high_kp: preferences?.alert_high_kp ?? true,
          alert_new_photos: preferences?.alert_new_photos ?? false,
          alert_challenges: preferences?.alert_challenges ?? true,
          is_active: true,
        },
        {
          onConflict: 'endpoint',
        }
      )
      .select()
      .single()

    if (error) throw error

    return successResponse(data, 201)
  } catch (error) {
    console.error('Error subscribing to push notifications:', error)
    return errorResponse(error.message, 500)
  }
})
