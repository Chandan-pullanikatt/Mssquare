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
        maxAge: 60 * 60 * 24 * 7, // 1 week
      }
    }
  )
}

// Global singleton for the browser
if (typeof window !== 'undefined') {
  console.log("Supabase Client: Initializing with URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
}
export const supabase = createClient();
