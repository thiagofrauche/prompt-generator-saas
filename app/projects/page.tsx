import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProjectsList } from "@/components/projects-list"

export default async function ProjectsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("payment_status, full_name, avatar_url")
    .eq("user_id", user.id)
    .single()

  if (!profile || profile.payment_status !== "paid") {
    redirect("/payment")
  }

  return (
    <div className="min-h-screen bg-transparent">
      <ProjectsList
        userId={user.id}
        userEmail={user.email!}
        userName={profile.full_name}
        userAvatar={profile.avatar_url}
      />
    </div>
  )
}
