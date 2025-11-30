import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const offerId = process.env.CAKTO_OFFER_ID

    if (!offerId) {
      return NextResponse.json({ error: "Cakto offer not configured" }, { status: 500 })
    }

    const checkoutBaseUrl = process.env.CAKTO_CHECKOUT_URL

    if (!checkoutBaseUrl) {
      return NextResponse.json({ error: "Cakto checkout URL not configured" }, { status: 500 })
    }

    const checkoutUrl = new URL(checkoutBaseUrl)
    checkoutUrl.searchParams.set("email", user.email!)
    if (profile.full_name) {
      checkoutUrl.searchParams.set("name", profile.full_name)
    }

    checkoutUrl.searchParams.set("metadata[user_id]", user.id)

    return NextResponse.json({
      checkoutUrl: checkoutUrl.toString(),
      offerId,
    })
  } catch (error) {
    console.error("[v0] Checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 })
  }
}
