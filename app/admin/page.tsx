import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("is_admin, full_name, avatar_url")
    .eq("user_id", user.id)
    .single()

  if (!adminProfile?.is_admin) {
    redirect("/dashboard")
  }

  // Fetch all profiles for admin view
  const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  // Get total prompt count per user
  const { data: promptCounts } = await supabase.from("prompts").select("user_id, id")

  const promptCountMap = (promptCounts || []).reduce(
    (acc, { user_id }) => {
      acc[user_id] = (acc[user_id] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <AdminDashboard
      profiles={profiles || []}
      promptCounts={promptCountMap}
      adminEmail={user.email || ""}
      userName={adminProfile.full_name}
      userAvatar={adminProfile.avatar_url}
    />
  )
}
