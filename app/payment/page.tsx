import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ExternalLink } from "lucide-react"
import Image from "next/image"

const CAKTO_CHECKOUT_URL = "https://pay.cakto.com.br/jbn2s2i_670369"

export default async function PaymentPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-transparent">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image src="/amora-full-logo.png" alt="AMORA AI" width={300} height={120} priority />
        </div>
        <Card className="border-purple-500/20 bg-black/80 backdrop-blur-sm text-white">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-yellow-400" />
            </div>
            <CardTitle className="text-2xl text-center text-white">Pagamento Necessário</CardTitle>
            <CardDescription className="text-center text-white/80">
              Para continuar usando o AMORA AI Prompt Maker, você precisa completar sua assinatura.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-purple-900/30 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-purple-300">Status:</span>
                <span className="text-sm font-semibold text-yellow-400">
                  {profile?.payment_status === "pending" ? "Pendente" : "Expirado"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-purple-300">Email:</span>
                <span className="text-sm text-white">{user.email}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700 text-lg h-12 text-white"
                asChild
              >
                <a
                  href={CAKTO_CHECKOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  Assinar Agora
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <p className="text-sm text-center text-purple-300">
                Você será redirecionado para a página de pagamento segura do Cakto
              </p>
            </div>

            <div className="pt-4 border-t border-purple-500/20">
              <p className="text-sm text-center text-purple-300 mb-3">
                Após realizar o pagamento, sua conta será ativada automaticamente.
              </p>
              <Button
                variant="outline"
                className="w-full border-purple-500/30 hover:bg-purple-900/30 bg-transparent text-white"
                asChild
              >
                <a href="mailto:amoraaipromptmaker@gmail.com">Precisa de ajuda? Contate o suporte</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
