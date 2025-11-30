import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect unauthenticated users to login (except public routes)
  if (!user && !request.nextUrl.pathname.startsWith("/auth") && request.nextUrl.pathname !== "/") {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // Check payment status for authenticated users
  if (user && !request.nextUrl.pathname.startsWith("/auth")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("payment_status, payment_expires_at")
      .eq("id", user.id)
      .single()

    // Redirect to payment page if payment is pending or expired
    if (
      profile &&
      (profile.payment_status === "pending" ||
        (profile.payment_status === "active" &&
          profile.payment_expires_at &&
          new Date(profile.payment_expires_at) < new Date()))
    ) {
      if (!request.nextUrl.pathname.startsWith("/payment")) {
        const url = request.nextUrl.clone()
        url.pathname = "/payment"
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
