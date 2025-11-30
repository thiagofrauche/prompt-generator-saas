"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Check, Copy, RotateCcw, Sparkles, Edit3, Save } from "lucide-react"

type PromptResultProps = {
  prompt: string
  onReset: () => void
}

export function PromptResult({ prompt, onReset }: PromptResultProps) {
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedPrompt, setEditedPrompt] = useState(prompt)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary via-secondary to-accent animate-pulse">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-balance bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Seu AMORA Prompt está pronto!
        </h2>
        <p className="text-muted-foreground">Prompt técnico em inglês otimizado para IAs de geração</p>
      </div>

      <Card className="p-6 glass-effect border-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Prompt Gerado</h3>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-2 rounded-full bg-transparent"
                >
                  <Edit3 className="h-4 w-4" />
                  Editar
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="gap-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white border-0"
                >
                  <Save className="h-4 w-4" />
                  Salvar
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 rounded-full bg-transparent">
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>

          {isEditing ? (
            <Textarea
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              rows={15}
              className="font-mono text-sm resize-none"
            />
          ) : (
            <div className="bg-muted/50 rounded-lg p-6 max-h-96 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">{editedPrompt}</pre>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-4">
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">ChatGPT</span>
            <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full">Midjourney</span>
            <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Runway</span>
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">Pika</span>
            <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full">Flux</span>
            <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Leonardo</span>
          </div>
        </div>
      </Card>

      <div className="flex justify-center">
        <Button onClick={onReset} variant="outline" className="gap-2 rounded-full bg-transparent">
          <RotateCcw className="h-4 w-4" />
          Criar Novo Prompt
        </Button>
      </div>

      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>✨ Pronto para usar em qualquer IA de geração de imagem ou vídeo</p>
        <p>🇧🇷 Textos em português preservados exatamente como você escreveu</p>
      </div>
    </div>
  )
}
