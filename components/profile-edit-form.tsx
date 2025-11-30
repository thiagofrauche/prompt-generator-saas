"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "./header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { Camera, Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type ProfileEditFormProps = {
  userId: string
  userEmail: string
  userName?: string
  userAvatar?: string
  userPhone?: string
}

export function ProfileEditForm({ userId, userEmail, userName, userAvatar, userPhone }: ProfileEditFormProps) {
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState(userName || "")
  const [email, setEmail] = useState(userEmail)
  const [phone, setPhone] = useState(userPhone || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [avatarUrl, setAvatarUrl] = useState(userAvatar || "")
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const handleSave = async () => {
    setLoading(true)

    try {
      const supabase = createClient()

      // Update profile (name, phone, avatar)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone,
          avatar_url: avatarUrl,
        })
        .eq("user_id", userId)

      if (profileError) throw profileError

      // Update email if changed
      if (email !== userEmail) {
        const { error: emailError } = await supabase.auth.updateUser({
          email,
        })
        if (emailError) throw emailError
      }

      // Update password if provided
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          toast({
            title: "Erro",
            description: "As senhas não coincidem",
            variant: "destructive",
          })
          setLoading(false)
          return
        }

        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword,
        })
        if (passwordError) throw passwordError
      }

      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      console.error("[v0] Error updating profile:", error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar perfil",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userEmail={userEmail} userName={fullName} userAvatar={avatarUrl} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold text-balance bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Editar Perfil
          </h1>
          <p className="text-muted-foreground">Atualize suas informações pessoais</p>
        </div>

        <Card className="p-8 glass-effect">
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={fullName || userEmail} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl font-semibold">
                  {fullName?.[0]?.toUpperCase() || userEmail[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="URL da foto de perfil"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-64"
                />
                <Button variant="outline" size="icon">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Seu nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Alterar o email enviará um email de confirmação para o novo endereço
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Password Section */}
            <div className="pt-4 border-t border-border/50 space-y-4">
              <h3 className="text-lg font-semibold">Alterar Senha</h3>
              <p className="text-sm text-muted-foreground">Deixe em branco se não quiser alterar</p>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => router.push("/dashboard")} className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary to-secondary"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
