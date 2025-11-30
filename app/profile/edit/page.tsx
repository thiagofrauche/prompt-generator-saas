import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileEditForm } from "@/components/profile-edit-form"

export default async function EditProfilePage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("payment_status, full_name, avatar_url, phone")
    .eq("user_id", user.id)
    .single()

  if (!profile || profile.payment_status !== "paid") {
    redirect("/payment")
  }

  return (
    <div className="min-h-screen bg-transparent">
      <ProfileEditForm
        userId={user.id}
        userEmail={user.email!}
        userName={profile.full_name}
        userAvatar={profile.avatar_url}
        userPhone={profile.phone}
      />
    </div>
  )
}
