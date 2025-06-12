import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// This is the definitive, corrected version of the Supabase client for Server Components.
// The key insight is that the `cookies()` function from `next/headers` can return
// a Promise, and our adapter must handle that correctly.
export function createClient() {
    // We get the cookie store object from Next.js.
    // The TypeScript server is correctly identifying this as a Promise.
    const cookieStore = cookies()

    // We return a new Supabase client, configured with a custom cookie handler.
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            // The `cookies` object is our adapter layer.
            cookies: {
                // The `getAll` method that Supabase's client will call can be async.
                // This is the key to solving the problem.
                getAll: async () => {
                    // We `await` the cookieStore promise to get the actual cookie object.
                    const resolvedCookieStore = await cookieStore;
                    // Then we call the synchronous `getAll()` method on the resolved object.
                    return resolvedCookieStore.getAll();
                },
                // We continue to omit `setAll`, as this is a read-only client
                // for use in Server Components, which cannot set cookies.
            },
        }
    )
}