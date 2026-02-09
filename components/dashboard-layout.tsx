"use client"

import type React from "react"
import { useState, useTransition } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Store, Users, LogOut, Menu, X, ChevronRight, Loader2, Calendar, Rocket } from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/app/actions/auth-actions"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRoles?: string[]
}

export function DashboardLayout({ children, userRoles = ["user"] }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "zona_execucao"] },
    { name: "Nova Loja", href: "/nova-loja", icon: Store, roles: ["admin", "zona_execucao"] },
    { name: "Reunioes", href: "/reunioes", icon: Calendar, roles: ["admin", "comercial"] },
    { name: "Zona de Execucao", href: "/zona-de-execucao", icon: Rocket, roles: ["admin", "comercial", "zona_execucao"] },
    { name: "Usuarios", href: "/admin", icon: Users, roles: ["admin"] },
  ]

  const filteredNavigation = navigation.filter((item) => item.roles.some(role => userRoles.includes(role)))

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction()
    })
  }

  return (
    <div className="flex h-screen bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0 lg:static lg:z-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="text-lg font-semibold text-foreground">Pro Growth</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground p-1 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2 block">Menu</span>
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}>
                <item.icon className="h-4 w-4" />
                {item.name}
                {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Button variant="ghost" onClick={handleLogout} disabled={isPending} className="w-full justify-start text-muted-foreground hover:text-foreground">
            {isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saindo...</>
            ) : (
              <><LogOut className="h-4 w-4 mr-2" />Sair da conta</>
            )}
          </Button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center p-4 border-b border-border lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground mr-4 p-2 rounded-lg hover:bg-muted">
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-lg font-semibold text-foreground">
            {filteredNavigation.find((item) => item.href === pathname)?.name || "Dashboard"}
          </span>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
