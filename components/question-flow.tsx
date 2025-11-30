"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ChevronRight, ImageIcon, Camera, Video, Sparkles, Paperclip, X, Save } from "lucide-react"
import type { FormData } from "./prompt-maker"

type QuestionFlowProps = {
  onGenerate: (data: FormData) => void
  onSaveProject: (data: FormData) => void
  initialData: FormData
  files: File[]
  onFilesChange: (files: File[]) => void
}

export function QuestionFlow({ onGenerate, onSaveProject, initialData, files, onFilesChange }: QuestionFlowProps) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>(initialData)

  const handleNext = () => {
    if (step < 6) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleGenerate = () => {
    onGenerate(data)
  }

  const handleSave = () => {
    onSaveProject(data)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      onFilesChange([...files, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  const canProceed = () => {
    if (step === 1) return data.type !== ""
    if (step === 2) return data.subject.trim() !== ""
    if (step === 3) return data.environment.trim() !== ""
    if (step === 4) return data.style.trim() !== ""
    return true
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-4xl font-bold text-balance bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Crie seu Prompt Perfeito
        </h2>
        <p className="text-muted-foreground">Responda às perguntas para gerar um prompt técnico e profissional</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div
            key={num}
            className={`h-2 rounded-full transition-all duration-300 ${
              num <= step ? "w-12 bg-gradient-to-r from-primary to-secondary" : "w-8 bg-muted"
            }`}
          />
        ))}
      </div>

      <Card className="p-8 glass-effect border-2">
        {/* Step 1: Type */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-white">1. O que você quer gerar?</Label>
              <p className="text-sm text-muted-foreground">Escolha o tipo de conteúdo que deseja criar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setData({ ...data, type: "image" })}
                className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                  data.type === "image" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <ImageIcon className="h-12 w-12 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-1 text-white">Imagem</h3>
                <p className="text-xs text-muted-foreground">Arte digital, ilustrações</p>
              </button>

              <button
                onClick={() => setData({ ...data, type: "photo" })}
                className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                  data.type === "photo" ? "border-secondary bg-secondary/10" : "border-border hover:border-secondary/50"
                }`}
              >
                <Camera className="h-12 w-12 mx-auto mb-3 text-secondary" />
                <h3 className="font-semibold mb-1 text-white">Foto Profissional</h3>
                <p className="text-xs text-muted-foreground">Fotografia realista</p>
              </button>

              <button
                onClick={() => setData({ ...data, type: "video" })}
                className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                  data.type === "video" ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"
                }`}
              >
                <Video className="h-12 w-12 mx-auto mb-3 text-accent" />
                <h3 className="font-semibold mb-1 text-white">Vídeo / Clipe</h3>
                <p className="text-xs text-muted-foreground">Animações, motion</p>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Subject */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-white">2. Descreva o assunto ou personagem principal</Label>
              <p className="text-sm text-muted-foreground">Seja específico sobre quem ou o que aparece</p>
            </div>

            <Textarea
              placeholder="Ex: Uma mulher loira entre 25 e 30 anos testando um spray desodorante..."
              value={data.subject}
              onChange={(e) => setData({ ...data, subject: e.target.value })}
              rows={5}
              className="resize-none"
            />

            <p className="text-xs text-muted-foreground">
              💡 Inclua detalhes como idade, aparência, ações, roupas, etc.
            </p>
          </div>
        )}

        {/* Step 3: Environment */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-white">3. Descreva o ambiente ou cena</Label>
              <p className="text-sm text-muted-foreground">Onde a cena acontece?</p>
            </div>

            <Textarea
              placeholder="Ex: Banheiro moderno, luz natural suave..."
              value={data.environment}
              onChange={(e) => setData({ ...data, environment: e.target.value })}
              rows={5}
              className="resize-none"
            />

            <p className="text-xs text-muted-foreground">💡 Descreva o local, iluminação, elementos do cenário</p>
          </div>
        )}

        {/* Step 4: Style */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-white">4. Qual é o estilo visual?</Label>
              <p className="text-sm text-muted-foreground">Como deve ser a estética da imagem/vídeo?</p>
            </div>

            <Input
              placeholder="Ex: Realista, Cinematográfico, Iluminação de estúdio, Anime, Futurista..."
              value={data.style}
              onChange={(e) => setData({ ...data, style: e.target.value })}
            />

            <div className="flex flex-wrap gap-2">
              {["Realista", "Cinematográfico", "Anime", "Minimalista", "Futurista", "Vintage"].map((style) => (
                <Button
                  key={style}
                  variant="outline"
                  size="sm"
                  onClick={() => setData({ ...data, style })}
                  className="rounded-full"
                >
                  {style}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Text */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-white">5. Texto que deve aparecer na imagem/vídeo</Label>
              <p className="text-sm text-muted-foreground">(Opcional) Deixe em branco se não houver texto</p>
            </div>

            <Input
              placeholder='Ex: "Fresco o dia todo"'
              value={data.text}
              onChange={(e) => setData({ ...data, text: e.target.value })}
            />

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <p className="text-xs text-accent-foreground">⚠️ Este texto permanecerá em português no prompt final</p>
            </div>
          </div>
        )}

        {/* Step 6: Details */}
        {step === 6 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-white">6. Detalhes técnicos ou mood adicional</Label>
              <p className="text-sm text-muted-foreground">(Opcional) Aspectos técnicos, atmosfera, qualidade</p>
            </div>

            <Textarea
              placeholder="Ex: Sombras suaves, iluminação dramática, 4K, 60fps, mood estético..."
              value={data.details}
              onChange={(e) => setData({ ...data, details: e.target.value })}
              rows={5}
              className="resize-none"
            />

            <p className="text-xs text-muted-foreground">
              💡 Inclua detalhes sobre câmera, iluminação, resolução, mood
            </p>
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <Label className="text-sm font-medium text-white">Arquivos Anexados</Label>
            <div className="flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-lg px-3 py-2 text-xs"
                >
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
            Voltar
          </Button>

          <div className="flex items-center gap-2">
            {/* Save Button */}
            <Button variant="outline" onClick={handleSave} disabled={!canProceed()} className="gap-2 bg-transparent">
              <Save className="h-4 w-4" />
              Salvar
            </Button>

            {/* Attach Files */}
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="inline-flex items-center justify-center gap-2 h-10 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
                <Paperclip className="h-4 w-4" />
                <span className="text-sm font-medium">Anexar</span>
                {files.length > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gradient-to-r from-primary to-secondary rounded-full">
                    {files.length}
                  </span>
                )}
              </div>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Next/Generate Button */}
            {step < 6 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleGenerate}
                disabled={!canProceed()}
                className="gap-2 bg-gradient-to-r from-secondary to-accent hover:opacity-90"
              >
                <Sparkles className="h-4 w-4" />
                Gerar Prompt
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
