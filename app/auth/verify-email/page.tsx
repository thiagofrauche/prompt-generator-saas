import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-transparent">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image src="/amora-full-logo.png" alt="AMORA AI" width={300} height={120} priority />
        </div>
        <Card className="border-purple-500/20 bg-black/80 backdrop-blur-sm text-white">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-400" />
            </div>
            <CardTitle className="text-2xl text-center text-white">Verifique seu Email</CardTitle>
            <CardDescription className="text-center text-white/80">
              Enviamos um link de confirmação para o seu email. Por favor, verifique sua caixa de entrada e clique no
              link para ativar sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-sm text-purple-300">Não recebeu o email? Verifique sua pasta de spam.</div>
            <div className="mt-6 text-center text-sm">
              <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 underline underline-offset-4">
                Voltar para o login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
