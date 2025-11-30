"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "./header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { FolderOpen, Trash2, Copy, Check, Pencil } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

type Project = {
  id: string
  title: string
  description: string | null
  type: string
  generated_prompt: string
  attached_files: Array<{ name: string; size: number }>
  created_at: string
  updated_at: string
}

type ProjectsListProps = {
  userId: string
  userEmail: string
  userName?: string
  userAvatar?: string
}

export function ProjectsList({ userId, userEmail, userName, userAvatar }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadProjects()
  }, [userId])

  const loadProjects = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error loading projects:", error)
    } else {
      setProjects(data || [])
    }
    setLoading(false)
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return

    const supabase = createClient()
    const { error } = await supabase.from("projects").delete().eq("id", projectId)

    if (error) {
      console.error("[v0] Error deleting project:", error)
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== projectId))
    }
  }

  const handleCopy = async (prompt: string, projectId: string) => {
    await navigator.clipboard.writeText(prompt)
    setCopiedId(projectId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const handleEdit = (projectId: string) => {
    router.push(`/dashboard?projectId=${projectId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userEmail={userEmail} userName={userName} userAvatar={userAvatar} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold text-balance bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Meus Projetos
          </h1>
          <p className="text-muted-foreground">Todos os seus projetos salvos em um só lugar</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
          </div>
        ) : projects.length === 0 ? (
          <Card className="p-12 text-center glass-effect">
            <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Nenhum projeto salvo ainda</h3>
            <p className="text-muted-foreground mb-6">Comece criando seu primeiro projeto!</p>
            <Button onClick={() => router.push("/dashboard")} className="bg-gradient-to-r from-primary to-secondary">
              Criar Projeto
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="p-6 glass-effect hover:border-primary/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">{project.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(project.created_at), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary shrink-0 ml-2">
                    {project.type}
                  </span>
                </div>

                {project.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                )}

                <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mb-4">
                  <p className="text-sm font-mono text-foreground/80 line-clamp-3">{project.generated_prompt}</p>
                </div>

                {project.attached_files && project.attached_files.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Arquivos anexados:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.attached_files.map((file, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-accent/10 text-accent-foreground"
                        >
                          {file.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(project.id)} className="flex-1">
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(project.generated_prompt, project.id)}
                    className="flex-1"
                  >
                    {copiedId === project.id ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
