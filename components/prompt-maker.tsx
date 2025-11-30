"use client"

import { useState } from "react"
import { Header } from "./header"
import { QuestionFlow } from "./question-flow"
import { PromptResult } from "./prompt-result"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export type FormData = {
  type: "image" | "photo" | "video" | ""
  subject: string
  environment: string
  style: string
  text: string
  details: string
}

type PromptMakerProps = {
  userId: string
  userEmail: string
  userName?: string
  userAvatar?: string
}

export default function PromptMaker({ userId, userEmail, userName, userAvatar }: PromptMakerProps) {
  const [files, setFiles] = useState<File[]>([])
  const [formData, setFormData] = useState<FormData>({
    type: "",
    subject: "",
    environment: "",
    style: "",
    text: "",
    details: "",
  })
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("")
  const [showResult, setShowResult] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSaveProject = async (data: FormData) => {
    try {
      const supabase = createClient()
      const title = data.subject || data.type || "Projeto sem título"

      const { error } = await supabase.from("projects").insert({
        user_id: userId,
        title,
        description: data.environment,
        type: data.type,
        subject: data.subject,
        environment: data.environment,
        style: data.style,
        text_content: data.text,
        details: data.details,
        generated_prompt: generatePrompt(data, files),
        attached_files: files.map((f) => ({ name: f.name, size: f.size })),
      })

      if (error) throw error

      toast({
        title: "Projeto salvo!",
        description: "Seu projeto foi salvo com sucesso",
      })
    } catch (error) {
      console.error("[v0] Error saving project:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar o projeto",
        variant: "destructive",
      })
    }
  }

  const handleGenerate = async (data: FormData) => {
    setFormData(data)
    const prompt = generatePrompt(data, files)
    setGeneratedPrompt(prompt)

    try {
      const supabase = createClient()
      const title = data.subject || data.type || "Untitled Prompt"

      await supabase.from("prompts").insert({
        user_id: userId,
        title,
        generated_prompt: prompt,
        answers: data,
        attached_files: files.map((f) => ({ name: f.name, size: f.size })),
      })
    } catch (error) {
      console.error("[v0] Error saving prompt:", error)
    }

    setShowResult(true)
  }

  const handleReset = () => {
    setShowResult(false)
    setGeneratedPrompt("")
    setFormData({
      type: "",
      subject: "",
      environment: "",
      style: "",
      text: "",
      details: "",
    })
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userEmail={userEmail} userName={userName} userAvatar={userAvatar} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {!showResult ? (
          <QuestionFlow
            onGenerate={handleGenerate}
            onSaveProject={handleSaveProject}
            initialData={formData}
            files={files}
            onFilesChange={setFiles}
          />
        ) : (
          <PromptResult prompt={generatedPrompt} onReset={handleReset} />
        )}
      </main>
    </div>
  )
}

function generatePrompt(data: FormData, files: File[]): string {
  let typeText = ""
  if (data.type === "image") typeText = "image"
  if (data.type === "photo") typeText = "professional photograph"
  if (data.type === "video") typeText = "video/video clip"

  let prompt = `Create a high-quality ${typeText} with the following specifications:\n\n`

  if (data.subject) {
    prompt += `Subject:\n${data.subject}\n\n`
  }

  if (data.environment) {
    prompt += `Environment:\n${data.environment}\n\n`
  }

  if (data.style) {
    prompt += `Artistic Style:\n${data.style}\n\n`
  }

  if (data.details) {
    prompt += `Technical Details:\n${data.details}\n\n`
  }

  if (data.text) {
    prompt += `Text (must appear exactly as written in Brazilian Portuguese):\n"${data.text}"\n\n`
  }

  if (files.length > 0) {
    prompt += `References:\nUse the ${files.length} attached reference image${files.length > 1 ? "s" : ""} as stylistic and compositional guidance for color palette, lighting, composition, and overall aesthetic direction.\n\n`
  }

  prompt += `Final Requirements:\nUltra-detailed, coherent, professional quality, consistent lighting and composition, high-resolution output suitable for professional use.`

  return prompt
}
