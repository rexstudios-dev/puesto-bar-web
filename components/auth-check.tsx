"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthCheckProps {
  children: React.ReactNode
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const authStatus = localStorage.getItem("puestoBarAuth")
    const authTime = localStorage.getItem("puestoBarAuthTime")

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
    } else {
      // Limpiar autenticación expirada
      localStorage.removeItem("puestoBarAuth")
      localStorage.removeItem("puestoBarAuthTime")

      // Redirigir al login
      router.push("/login")
    }

    setIsLoading(false)
  }, [router])

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
      </div>
    )
  }

  // Solo mostrar el contenido si está autenticado
  return isAuthenticated ? <>{children}</> : null
}

