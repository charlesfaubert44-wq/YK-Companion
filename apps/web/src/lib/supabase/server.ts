import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client for server-side operations
 * 
 * Uses Next.js cookies for session management in server components and API routes.
 * Validates environment variables before creating the client.
 * 
 * @returns {Promise<SupabaseClient>} Configured Supabase server client
 * @throws {Error} If environment variables are missing or contain placeholder values
 * 
 * @example
 * ```ts
 * // In a Server Component or API Route
 * const supabase = await createClient();
 * const { data } = await supabase.from('profiles').select('*');
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local'
    );
  }

  if (supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key')) {
    throw new Error(
      'Supabase environment variables contain placeholder values. Please update them with actual credentials in .env.local'
    );
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
