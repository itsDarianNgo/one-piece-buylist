import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// This is the definitive middleware implementation, based on the latest
// official Supabase SSR patterns. It correctly handles session refreshes
// and route protection.
export async function middleware(request: NextRequest) {
    // 1. CREATE THE RESPONSE OBJECT
    // We create a response object that we can modify and return.
    // This is a key part of the pattern: the `response` variable is
    // available in the closure of the cookie methods below.
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 2. CREATE THE SUPABASE CLIENT
    // We instantiate the client with our new, correct cookie handler.
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                // The `getAll` method reads all cookies from the incoming request.
                getAll() {
                    return request.cookies.getAll()
                },
                // The `setAll` method takes an array of cookies from the Supabase client
                // and applies them to both the incoming request and the outgoing response.
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        // We set the cookie on the request so that it's available for
                        // any other server-side logic in this request cycle.
                        request.cookies.set(name, value)
                        // We set the cookie on the response so that the browser receives it.
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // 3. REFRESH THE SESSION
    // IMPORTANT: This call to `getUser()` is what triggers the cookie methods
    // if the user's session token needs to be refreshed.
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // 4. IMPLEMENT ROUTE PROTECTION
    // If the user is not authenticated and is trying to access a protected route,
    // redirect them to the login page.
    if (!user && request.nextUrl.pathname.startsWith('/admin')) {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    // If the user is authenticated and tries to visit the login page,
    // redirect them to their dashboard.
    if (user && request.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    // 5. RETURN THE RESPONSE
    // If no redirection is needed, return the response object. This object
    // now contains any updated session cookies if a refresh occurred.
    return response
}

// Define which paths the middleware should run on.
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * We exclude /api routes from the middleware to prevent conflicts.
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}