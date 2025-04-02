"use client"

import { useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { getSiteConfig } from "@/lib/store"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  // Aplicar estilos solo después de la hidratación
  useEffect(() => {
    setMounted(true)

    // Obtener configuración inicial
    const config = getSiteConfig()
    applyStyles(config)

    // Escuchar cambios en la configuración
    const handleConfigChange = (event: CustomEvent) => {
      applyStyles(event.detail)
    }

    window.addEventListener("siteConfigChanged", handleConfigChange as EventListener)

    return () => {
      window.removeEventListener("siteConfigChanged", handleConfigChange as EventListener)
    }
  }, [])

  // Función para aplicar estilos de manera segura
  const applyStyles = (config: any) => {
    if (!mounted) return

    // Crear un elemento de estilo en lugar de modificar el html directamente
    let styleEl = document.getElementById("theme-styles")
    if (!styleEl) {
      styleEl = document.createElement("style")
      styleEl.id = "theme-styles"
      document.head.appendChild(styleEl)
    }

    // Aplicar variables CSS a través de un elemento de estilo
    styleEl.textContent = `
      :root {
        --primary-color: ${config.primaryColor || "#B45309"};
        --secondary-color: ${config.secondaryColor || "#F59E0B"};
        --accent-color: ${config.accentColor || "#D97706"};
        --background-color: ${config.backgroundColor || "#F9F5F0"};
        --text-color: ${config.textColor || "#1F2937"};
      }
    `
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

