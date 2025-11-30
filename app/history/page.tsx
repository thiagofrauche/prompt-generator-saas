import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { PromptHistory } from "@/components/prompt-history"

export default async function HistoryPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("user_id", user.id)
    .single()

  const { data: prompts } = await supabase
    .from("prompts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <PromptHistory
      prompts={prompts || []}
      userEmail={user.email || ""}
      userName={profile?.full_name}
      userAvatar={profile?.avatar_url}
    />
  )
}
