"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import DashboardSidebar from "@/components/dashboard/sidebar"
import DashboardHeader from "@/components/dashboard/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    // No verificar autenticación en la página de login
    if (pathname === "/dashboard/login") {
      setIsLoading(false)
      return
    }

    // Verificar si el usuario está autenticado
    const authStatus = localStorage.getItem("puestoBarDashboardAuth")
    const authTime = localStorage.getItem("puestoBarDashboardAuthTime")

    // Verificar si la autenticación ha expirado (24 horas)
    let isValid = false
    if (authStatus === "true" && authTime) {
      const authDate = new Date(authTime)
      const now = new Date()
      const hoursDiff = (now.getTime() - authDate.getTime()) / (1000 * 60 * 60)

      isValid = hoursDiff < 24
    }

    if (isValid) {
      setIsAuthenticated(true)
      setIsLoading(false)
    } else {
      // Limpiar autenticación expirada
      localStorage.removeItem("puestoBarDashboardAuth")
      localStorage.removeItem("puestoBarDashboardAuthTime")

      // Redirigir al login
      router.push("/dashboard/login")
    }
  }, [router, pathname])

  // Si estamos en la página de login, mostrar directamente el contenido
  if (pathname === "/dashboard/login") {
    return (
      <>
        {children}
        <Toaster />
      </>
    )
  }

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
      </div>
    )
  }

  // Solo mostrar el contenido si está autenticado
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>

      <Toaster />
    </div>
  )
}

