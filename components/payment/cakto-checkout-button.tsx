"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CreditCard, Loader2 } from "lucide-react"

interface CaktoCheckoutButtonProps {
  userEmail: string
  userName?: string | null
  paymentStatus?: string
}

export function CaktoCheckoutButton({ userEmail, userName, paymentStatus }: CaktoCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/cakto/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout")
      }

      const { checkoutUrl } = await response.json()

      window.location.href = checkoutUrl
    } catch (err) {
      console.error("[v0] Checkout error:", err)
      setError("Erro ao iniciar checkout. Tente novamente.")
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-purple-500/20 bg-purple-950/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-16 h-16 text-yellow-400" />
        </div>
        <CardTitle className="text-2xl text-center">
          {paymentStatus === "pending" ? "Ative sua Conta" : "Renovar Assinatura"}
        </CardTitle>
        <CardDescription className="text-center">
          Para continuar usando o AMORA AI Prompt Maker, complete o pagamento através da nossa plataforma segura.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-purple-900/30 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-purple-300">Nome:</span>
            <span className="text-sm">{userName || "Não informado"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-purple-300">Email:</span>
            <span className="text-sm">{userEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-purple-300">Status:</span>
            <span className="text-sm font-semibold text-yellow-400">
              {paymentStatus === "pending" ? "Pendente" : paymentStatus === "expired" ? "Expirado" : "Inativo"}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-magenta-500/20 p-6 rounded-lg border border-purple-500/30">
          <h3 className="text-lg font-semibold mb-2">Plano Mensal</h3>
          <p className="text-3xl font-bold mb-1">
            R$ 29,90<span className="text-base font-normal text-purple-300">/mês</span>
          </p>
          <ul className="space-y-2 text-sm text-purple-200 mb-4">
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Prompts ilimitados
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Anexar imagens de referência
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Histórico completo
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Suporte prioritário
            </li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">{error}</div>
        )}

        <div className="space-y-3">
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700 h-12 text-white"
            onClick={handleCheckout}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Pagar com Cakto
              </>
            )}
          </Button>
          <p className="text-xs text-center text-purple-300">
            Pagamento seguro processado pela Cakto. Você será redirecionado para completar o pagamento.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
