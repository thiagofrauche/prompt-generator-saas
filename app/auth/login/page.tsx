"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { Shield } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) throw signInError

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("payment_status, payment_expiry, is_admin")
          .eq("id", user.id)
          .single()

        if (profile?.is_admin) {
          router.push("/dashboard")
          router.refresh()
          return
        }

        const isExpired = profile?.payment_expiry && new Date(profile.payment_expiry) < new Date()

        if (profile?.payment_status !== "paid" || isExpired) {
          router.push("/payment")
          router.refresh()
          return
        }
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAdmin = async () => {
    const supabase = createClient()
    setIsCreatingAdmin(true)
    setError(null)

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: "amoraaipromptmaker@gmail.com",
        password: "thiago142208.at",
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        },
      })

      if (signUpError) throw signUpError

      if (signUpData.user) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            is_admin: true,
            payment_status: "paid",
            payment_expires_at: null,
          })
          .eq("id", signUpData.user.id)

        if (updateError) throw updateError
      }

      alert(
        "Conta de administrador criada com sucesso!\n\nEmail: amoraaipromptmaker@gmail.com\nSenha: thiago142208.at\n\nVerifique seu email para confirmar a conta.",
      )

      setEmail("amoraaipromptmaker@gmail.com")
      setPassword("thiago142208.at")
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("already registered")) {
          alert("Esta conta de administrador já existe! Use o formulário de login acima.")
          setEmail("amoraaipromptmaker@gmail.com")
          setPassword("thiago142208.at")
        } else {
          setError(error.message)
        }
      }
    } finally {
      setIsCreatingAdmin(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image src="/amora-full-logo.png" alt="AMORA AI" width={300} height={120} priority />
        </div>
        <Card className="border-purple-500/20 bg-black/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white">Entrar</CardTitle>
            <CardDescription className="text-center text-white/90">Acesse sua conta AMORA AI</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-900 border-purple-500/30 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-white">
                    Senha
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-900 border-purple-500/30 text-white placeholder:text-gray-400"
                  />
                </div>
                {error && <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </div>
              <div className="mt-6 text-center text-sm">
                <span className="text-white">Não tem uma conta?</span>{" "}
                <Link
                  href="/auth/sign-up"
                  className="text-purple-400 hover:text-purple-300 underline underline-offset-4"
                >
                  Criar conta
                </Link>
              </div>
            </form>
            <div className="mt-6 pt-6 border-t border-purple-500/20">
              <Button
                type="button"
                onClick={handleCreateAdmin}
                disabled={isCreatingAdmin}
                className="w-full bg-purple-900/50 hover:bg-purple-900/70 text-purple-200 border border-purple-500/30"
              >
                <Shield className="w-4 h-4 mr-2" />
                {isCreatingAdmin ? "Criando Admin..." : "Criar Acesso Admin"}
              </Button>
              <p className="text-xs text-white/60 text-center mt-2">
                Clique aqui para configurar seu acesso de administrador
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
