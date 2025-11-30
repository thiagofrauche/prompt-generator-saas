import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { listOrders } from "@/lib/cakto/client"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("payment_status, payment_expires_at, cakto_order_id")
      .eq("id", user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    if (profile.payment_status === "paid" && profile.cakto_order_id) {
      try {
        const orders = await listOrders({ customer: user.email! })
        const paidOrder = orders.results.find((order) => order.status === "paid" && order.id === profile.cakto_order_id)

        if (!paidOrder) {
          await supabase.from("profiles").update({ payment_status: "expired" }).eq("id", user.id)

          return NextResponse.json({
            status: "expired",
            message: "Payment verification failed",
          })
        }
      } catch (error) {
        console.error("[v0] Failed to verify payment with Cakto:", error)
      }
    }

    return NextResponse.json({
      status: profile.payment_status,
      expiresAt: profile.payment_expires_at,
      orderId: profile.cakto_order_id,
    })
  } catch (error) {
    console.error("[v0] Status check error:", error)
    return NextResponse.json({ error: "Failed to check status" }, { status: 500 })
  }
}
