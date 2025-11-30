import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, FileText, Zap, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col items-center text-center mb-16">
          <Image
            src="/amora-full-logo.png"
            alt="AMORA AI Prompt Maker"
            width={400}
            height={160}
            priority
            className="mb-8"
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
            Crie Prompts Profissionais para IA
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mb-8 text-pretty drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            Transforme suas ideias em prompts técnicos precisos para geração de imagens, fotos e vídeos com inteligência
            artificial
          </p>
          <div className="flex gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700 text-white"
              asChild
            >
              <Link href="/auth/sign-up">Começar Agora</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-500 text-white hover:bg-purple-500/10 bg-transparent"
              asChild
            >
              <Link href="/auth/login">Já tenho conta</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-black/60 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <Sparkles className="w-12 h-12 text-purple-400 mb-2" />
              <CardTitle className="text-white">Geração Guiada</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/70">
                Questionário intuitivo que guia você passo a passo na criação do prompt perfeito
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-black/60 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <FileText className="w-12 h-12 text-magenta-400 mb-2" />
              <CardTitle className="text-white">Anexar Referências</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/70">
                Faça upload de imagens de referência para guiar o estilo e composição do resultado
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-black/60 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <Zap className="w-12 h-12 text-violet-400 mb-2" />
              <CardTitle className="text-white">Prompts Técnicos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/70">
                Gere prompts em inglês técnico otimizados para as melhores IAs de geração
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-black/60 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <Shield className="w-12 h-12 text-purple-300 mb-2" />
              <CardTitle className="text-white">Histórico Seguro</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/70">
                Salve e acesse todos os seus prompts criados em um só lugar
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-white mb-4 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            Junte-se a centenas de criadores usando AMORA AI
          </p>
        </div>
      </div>
    </div>
  )
}
