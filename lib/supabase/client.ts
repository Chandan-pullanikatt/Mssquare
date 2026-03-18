import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        path: '/',
        secure: true,
        sameSite: 'lax',
      }
    }
  )
}

// Global singleton for the browser
export const supabase = createClient();
