import { createBrowserClient } from '@supabase/ssr'

// This function creates a Supabase client for use in Client Components.
// It's a singleton, meaning we only create it once per browser session.
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}