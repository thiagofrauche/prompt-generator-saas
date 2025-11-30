"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { SideMenu } from "./side-menu"

type HeaderProps = {
  userEmail?: string
  userName?: string
  userAvatar?: string
  onLogout?: () => void
}

export function Header({ userEmail, userName, userAvatar, onLogout }: HeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light")
    setTheme(initialTheme)
    document.documentElement.classList.toggle("dark", initialTheme === "dark")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <>
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-64">
              <Image
                src="/amora-logo-text.jpg"
                alt="AMORA AI - Prompt Maker"
                width={256}
                height={48}
                className="object-contain object-left"
                priority
              />
            </div>
          </div>
          {/* </CHANGE> */}

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            {userEmail && onLogout && (
              <Button variant="ghost" size="icon" onClick={() => setMenuOpen(true)} className="rounded-full relative">
                <div className="flex flex-col gap-1">
                  <div className="w-5 h-0.5 bg-foreground rounded-full" />
                  <div className="w-5 h-0.5 bg-foreground rounded-full" />
                  <div className="w-5 h-0.5 bg-foreground rounded-full" />
                  <div className="w-5 h-0.5 bg-foreground rounded-full" />
                </div>
              </Button>
            )}
          </div>
        </div>
      </header>

      {userEmail && onLogout && (
        <SideMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          userEmail={userEmail}
          userName={userName}
          userAvatar={userAvatar}
          onLogout={onLogout}
        />
      )}
    </>
  )
}
