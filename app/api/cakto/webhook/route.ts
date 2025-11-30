import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { CaktoWebhookEvent } from "@/lib/cakto/types"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const webhookData: CaktoWebhookEvent = await request.json()

    console.log("[v0] Cakto webhook received:", JSON.stringify(webhookData, null, 2))

    const webhookSecret = process.env.CAKTO_WEBHOOK_SECRET
    if (webhookSecret) {
      const authHeader = request.headers.get("authorization")
      if (authHeader !== `Bearer ${webhookSecret}`) {
        console.error("[v0] Webhook authentication failed")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const { event, order } = webhookData

    if (event === "purchase_approved" && order.status === "paid") {
      const customerEmail = order.customer.email

      console.log("[v0] Processing payment approval for:", customerEmail)

      const { data: user } = await supabase.auth.admin.listUsers()
      const targetUser = user?.users.find((u) => u.email === customerEmail)

      if (!targetUser) {
        console.error("[v0] User not found for email:", customerEmail)
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      const expirationDate = new Date()
      expirationDate.setMonth(expirationDate.getMonth() + 1) // 30 days

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          payment_status: "paid",
          payment_expires_at: expirationDate.toISOString(),
          cakto_order_id: order.id,
          cakto_ref_id: order.refId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", targetUser.id)

      if (updateError) {
        console.error("[v0] Failed to update profile:", updateError)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
      }

      console.log("[v0] Payment status updated successfully for user:", targetUser.id)

      return NextResponse.json({
        success: true,
        message: "Payment processed successfully",
        userId: targetUser.id,
      })
    }

    if (event === "subscription_canceled" || event === "order_refunded") {
      const customerEmail = order.customer.email

      console.log("[v0] Processing cancellation/refund for:", customerEmail)

      const { data: user } = await supabase.auth.admin.listUsers()
      const targetUser = user?.users.find((u) => u.email === customerEmail)

      if (targetUser) {
        await supabase
          .from("profiles")
          .update({
            payment_status: "expired",
            updated_at: new Date().toISOString(),
          })
          .eq("id", targetUser.id)

        console.log("[v0] Payment status set to expired for user:", targetUser.id)
      }
    }

    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error("[v0] Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
