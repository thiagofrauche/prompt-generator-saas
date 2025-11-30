"use client"

import { X, FolderOpen, UserCog, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

type SideMenuProps = {
  isOpen: boolean
  onClose: () => void
  userEmail: string
  userName?: string
  userAvatar?: string
  onLogout: () => void
}

export function SideMenu({ isOpen, onClose, userEmail, userName, userAvatar, onLogout }: SideMenuProps) {
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in" onClick={onClose} />}

      {/* Side Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-background/95 backdrop-blur-lg border-l border-border/50 z-50 transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Header: Avatar + Name & Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName || userEmail} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
                    {userName?.[0]?.toUpperCase() || userEmail[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{userName || userEmail.split("@")[0]}</p>
                  <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-accent shrink-0">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Menu Items */}
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-base hover:bg-accent/50 transition-colors"
                onClick={() => handleNavigation("/projects")}
              >
                <FolderOpen className="mr-3 h-5 w-5 text-primary" />
                Meus Projetos
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-base hover:bg-accent/50 transition-colors"
                onClick={() => handleNavigation("/profile/edit")}
              >
                <UserCog className="mr-3 h-5 w-5 text-secondary" />
                Editar Perfil
              </Button>
            </nav>

            {/* Logout Button */}
            <div className="pt-4 border-t border-border/50">
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-base text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                onClick={() => {
                  onLogout()
                  onClose()
                }}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sair
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
