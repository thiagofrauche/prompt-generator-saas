"use client"

import { useState } from "react"
import { Header } from "./header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Users, CreditCard, Trash2, Edit, Search, ShieldCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type Profile = {
  id: string
  user_id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  payment_status: string
  payment_expires_at: string | null
  created_at: string
}

type AdminDashboardProps = {
  profiles: Profile[]
  promptCounts: Record<string, number>
  adminEmail: string
  userName?: string
  userAvatar?: string
}

export function AdminDashboard({
  profiles: initialProfiles,
  promptCounts,
  adminEmail,
  userName,
  userAvatar,
}: AdminDashboardProps) {
  const [profiles, setProfiles] = useState(initialProfiles)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [newExpiryDate, setNewExpiryDate] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const handleUpdatePayment = async () => {
    if (!editingProfile) return

    const supabase = createClient()
    const { error } = await supabase
      .from("profiles")
      .update({
        payment_status: newStatus,
        payment_expires_at: newExpiryDate || null,
      })
      .eq("user_id", editingProfile.user_id)

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status de pagamento",
        variant: "destructive",
      })
    } else {
      setProfiles(
        profiles.map((p) =>
          p.user_id === editingProfile.user_id
            ? { ...p, payment_status: newStatus, payment_expires_at: newExpiryDate || null }
            : p,
        ),
      )
      toast({
        title: "Atualizado",
        description: "Status de pagamento atualizado com sucesso",
      })
      setEditingProfile(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    const supabase = createClient()

    const { error } = await supabase.from("profiles").delete().eq("user_id", userId)

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o usuário",
        variant: "destructive",
      })
    } else {
      setProfiles(profiles.filter((p) => p.user_id !== userId))
      toast({
        title: "Removido",
        description: "Usuário removido com sucesso",
      })
      setDeleteConfirmId(null)
    }
  }

  const openEditDialog = (profile: Profile) => {
    setEditingProfile(profile)
    setNewStatus(profile.payment_status)
    setNewExpiryDate(profile.payment_expires_at ? new Date(profile.payment_expires_at).toISOString().split("T")[0] : "")
  }

  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch =
      profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || profile.payment_status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: profiles.length,
    paid: profiles.filter((p) => p.payment_status === "paid").length,
    pending: profiles.filter((p) => p.payment_status === "pending").length,
    expired: profiles.filter(
      (p) => p.payment_status === "paid" && p.payment_expires_at && new Date(p.payment_expires_at) < new Date(),
    ).length,
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userEmail={adminEmail} userName={userName} userAvatar={userAvatar} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center gap-2 mb-8">
          <ShieldCheck className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <p className="text-muted-foreground">Gerenciar usuários e status de pagamento</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-purple-500/20 bg-purple-950/30 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardDescription>Total de Usuários</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <Users className="w-8 h-8 text-purple-400" />
            </CardContent>
          </Card>

          <Card className="border-green-500/20 bg-green-950/30 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardDescription>Usuários Pagantes</CardDescription>
              <CardTitle className="text-3xl text-green-400">{stats.paid}</CardTitle>
            </CardHeader>
            <CardContent>
              <CreditCard className="w-8 h-8 text-green-400" />
            </CardContent>
          </Card>

          <Card className="border-yellow-500/20 bg-yellow-950/30 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardDescription>Pagamentos Pendentes</CardDescription>
              <CardTitle className="text-3xl text-yellow-400">{stats.pending}</CardTitle>
            </CardHeader>
            <CardContent>
              <CreditCard className="w-8 h-8 text-yellow-400" />
            </CardContent>
          </Card>

          <Card className="border-red-500/20 bg-red-950/30 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardDescription>Pagamentos Expirados</CardDescription>
              <CardTitle className="text-3xl text-red-400">{stats.expired}</CardTitle>
            </CardHeader>
            <CardContent>
              <CreditCard className="w-8 h-8 text-red-400" />
            </CardContent>
          </Card>
        </div>

        <Card className="border-purple-500/20 bg-purple-950/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Gerenciar Usuários</CardTitle>
            <CardDescription>Visualizar, editar e remover usuários do sistema</CardDescription>
            <div className="flex gap-4 mt-4">
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">
                  Buscar
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar por email ou nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-purple-900/30 border-purple-500/30"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-purple-900/30 border-purple-500/30">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="paid">Pagos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-purple-500/20 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-purple-900/20">
                    <TableHead>Usuário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expira em</TableHead>
                    <TableHead>Prompts</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((profile) => {
                    const isExpired = profile.payment_expires_at && new Date(profile.payment_expires_at) < new Date()

                    return (
                      <TableRow key={profile.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{profile.full_name || "Sem nome"}</div>
                            <div className="text-sm text-muted-foreground">{profile.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={profile.payment_status === "paid" && !isExpired ? "default" : "secondary"}
                            className={
                              profile.payment_status === "paid" && !isExpired
                                ? "bg-green-500/20 text-green-400 border-green-500/50"
                                : profile.payment_status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                  : "bg-red-500/20 text-red-400 border-red-500/50"
                            }
                          >
                            {isExpired ? "Expirado" : profile.payment_status === "paid" ? "Pago" : "Pendente"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {profile.payment_expires_at
                            ? new Date(profile.payment_expires_at).toLocaleDateString("pt-BR")
                            : "—"}
                        </TableCell>
                        <TableCell>{promptCounts[profile.user_id] || 0}</TableCell>
                        <TableCell>{new Date(profile.created_at).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(profile)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteConfirmId(profile.user_id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={!!editingProfile} onOpenChange={() => setEditingProfile(null)}>
        <DialogContent className="border-purple-500/20 bg-purple-950/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Editar Status de Pagamento</DialogTitle>
            <DialogDescription>Atualize o status de pagamento de {editingProfile?.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger id="status" className="bg-purple-900/30 border-purple-500/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Data de Expiração (opcional)</Label>
              <Input
                id="expiry"
                type="date"
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
                className="bg-purple-900/30 border-purple-500/30"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProfile(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpdatePayment}
              className="bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700 text-white"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="border-red-500/20 bg-red-950/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-red-400">Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este usuário? Esta ação é permanente e irá excluir:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Conta do usuário</li>
                <li>Perfil e dados pessoais</li>
                <li>Todos os prompts e projetos criados</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancelar
            </Button>
            <Button
              onClick={() => deleteConfirmId && handleDeleteUser(deleteConfirmId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir Usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
