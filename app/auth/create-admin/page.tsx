"use client"

import type React from "react"

import { useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2, Copy, Check } from "lucide-react"
import Image from "next/image"

export default function CreateAdminPage() {
  const [email, setEmail] = useState("amoraaipromptmaker@gmail.com")
  const [password, setPassword] = useState("thiago142208.at")
  const [fullName, setFullName] = useState("Administrador AMORA")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [userId, setUserId] = useState("")
  const [copied, setCopied] = useState(false)

  const copyCredentials = () => {
    const credentials = `Email: ${email}\nSenha: ${password}`
    navigator.clipboard.writeText(credentials)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const supabase = createBrowserClient()

      // 1. Criar usuário no Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/login`,
        },
      })

      if (signUpError) throw signUpError
      if (!signUpData.user) throw new Error("Falha ao criar usuário")

      setUserId(signUpData.user.id)

      // 2. Aguardar um pouco para o perfil ser criado automaticamente
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 3. Atualizar o perfil para admin
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          is_admin: true,
          payment_status: "paid",
          payment_expires_at: "2099-12-31",
          full_name: fullName,
        })
        .eq("id", signUpData.user.id)

      if (updateError) {
        // Se falhar, pode ser que o perfil ainda não foi criado
        // Tenta inserir diretamente
        const { error: insertError } = await supabase.from("profiles").insert({
          id: signUpData.user.id,
          email: email,
          full_name: fullName,
          payment_status: "paid",
          payment_expires_at: "2099-12-31",
          is_admin: true,
        })

        if (insertError) throw insertError
      }

      setSuccess(true)
    } catch (err: any) {
      console.error("Erro ao criar admin:", err)
      setError(err.message || "Erro ao criar usuário administrador")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
      <Card className="w-full max-w-lg border-purple-500/20 bg-black/80 backdrop-blur-sm text-white">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Image src="/amora-icon.png" alt="AMORA AI" width={80} height={80} className="rounded-full" />
          </div>
          <div>
            <CardTitle className="text-2xl text-white">Criar Usuário Administrador</CardTitle>
            <CardDescription className="text-white/80">
              Configure as credenciais do administrador do sistema AMORA AI
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {success ? (
            <Alert className="border-green-500 bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <AlertDescription className="text-green-700 dark:text-green-300">
                <div className="space-y-2">
                  <p className="font-semibold">Usuário administrador criado com sucesso!</p>
                  <p className="text-sm">ID do usuário: {userId}</p>
                  <p className="text-sm mt-3">Use estas credenciais para fazer login:</p>
                  <div className="bg-background/50 p-3 rounded-md text-sm font-mono">
                    <p>Email: {email}</p>
                    <p>Senha: {password}</p>
                  </div>
                  <Button onClick={copyCredentials} variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Credenciais
                      </>
                    )}
                  </Button>
                  <Button onClick={() => (window.location.href = "/auth/login")} className="w-full mt-2">
                    Ir para Login
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Nome Completo</label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Administrador AMORA"
                  required
                  className="bg-gray-900/50 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="amoraaipromptmaker@gmail.com"
                  required
                  className="bg-gray-900/50 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Senha</label>
                <Input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite uma senha forte"
                  required
                  className="bg-gray-900/50 text-white"
                />
                <p className="text-xs text-purple-300">
                  Use uma senha forte com letras, números e caracteres especiais
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="bg-destructive/10">
                  <XCircle className="h-5 w-5" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando administrador...
                  </>
                ) : (
                  "Criar Usuário Administrador"
                )}
              </Button>
            </form>
          )}

          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center text-purple-300">
              Esta página cria um usuário com privilégios de administrador no sistema AMORA AI. Guarde as credenciais em
              um local seguro.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
