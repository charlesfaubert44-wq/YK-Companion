import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

/**
 * Create a Supabase client with the request authorization
 */
export function createSupabaseClient(req: Request) {
  const authHeader = req.headers.get('Authorization')!
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: { Authorization: authHeader },
    },
  })
}

/**
 * Create an admin Supabase client (bypasses RLS)
 */
export function createAdminClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  return createClient(supabaseUrl, supabaseServiceKey)
}
