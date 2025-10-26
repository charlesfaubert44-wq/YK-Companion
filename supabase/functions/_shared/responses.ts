import { corsHeaders } from './cors.ts'

/**
 * Success response helper
 */
export function successResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

/**
 * Error response helper
 */
export function errorResponse(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

/**
 * OPTIONS request handler for CORS
 */
export function handleOptions() {
  return new Response('ok', { headers: corsHeaders })
}
