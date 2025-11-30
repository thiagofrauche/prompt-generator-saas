import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import PromptMaker from "@/components/prompt-maker"

export default async function DashboardPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("payment_status, payment_expires_at, full_name, avatar_url")
    .eq("user_id", user.id)
    .single()

  // Check if payment is active
  if (
    !profile ||
    profile.payment_status !== "paid" ||
    (profile.payment_expires_at && new Date(profile.payment_expires_at) < new Date())
  ) {
    redirect("/payment")
  }

  return (
    <PromptMaker
      userId={user.id}
      userEmail={user.email || ""}
      userName={profile.full_name}
      userAvatar={profile.avatar_url}
    />
  )
}
