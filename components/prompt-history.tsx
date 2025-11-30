"use client"

import { useState } from "react"
import { Header } from "./header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Trash2, FileText, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type Prompt = {
  id: string
  title: string
  generated_prompt: string
  answers: Record<string, unknown>
  attached_files?: { name: string; size: number }[]
  created_at: string
}

type PromptHistoryProps = {
  prompts: Prompt[]
  userEmail: string
  userName?: string
  userAvatar?: string
}

export function PromptHistory({ prompts: initialPrompts, userEmail, userName, userAvatar }: PromptHistoryProps) {
  const [prompts, setPrompts] = useState(initialPrompts)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const handleCopy = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
    toast({
      title: "Copiado!",
      description: "Prompt copiado para a área de transferência",
    })
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("prompts").delete().eq("id", id)

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o prompt",
        variant: "destructive",
      })
    } else {
      setPrompts(prompts.filter((p) => p.id !== id))
      toast({
        title: "Excluído",
        description: "Prompt excluído com sucesso",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userEmail={userEmail} userName={userName} userAvatar={userAvatar} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Histórico de Prompts</h1>
          <p className="text-muted-foreground">Todos os prompts que você criou com AMORA AI</p>
        </div>

        {prompts.length === 0 ? (
          <Card className="border-purple-500/20 bg-purple-950/30 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum prompt criado ainda</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Comece a criar seus prompts profissionais para IA e eles aparecerão aqui
              </p>
              <Button
                className="bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700 text-white"
                onClick={() => router.push("/dashboard")}
              >
                Criar Primeiro Prompt
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {prompts.map((prompt) => (
              <Card key={prompt.id} className="border-purple-500/20 bg-purple-950/30 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{prompt.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(prompt.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleCopy(prompt.generated_prompt)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(prompt.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {prompt.attached_files && prompt.attached_files.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">
                        {prompt.attached_files.length} arquivo
                        {prompt.attached_files.length > 1 ? "s" : ""} anexado
                        {prompt.attached_files.length > 1 ? "s" : ""}
                      </Badge>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre
                      className={`text-sm bg-purple-900/30 p-4 rounded-lg overflow-hidden transition-all ${
                        expandedId === prompt.id ? "max-h-none" : "max-h-32"
                      }`}
                    >
                      <code className="whitespace-pre-wrap break-words">{prompt.generated_prompt}</code>
                    </pre>
                    {expandedId !== prompt.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-purple-900/30 to-transparent" />
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => setExpandedId(expandedId === prompt.id ? null : prompt.id)}
                  >
                    {expandedId === prompt.id ? "Ver menos" : "Ver mais"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
