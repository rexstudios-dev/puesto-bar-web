"use client"

import { useEffect } from "react"
import { getSiteConfig } from "@/lib/store"

// Este componente se encarga de inicializar los estilos solo en el cliente
// para evitar problemas de hidratación
export default function StyleInitializer() {
  useEffect(() => {
    // Obtener configuración actual
    const config = getSiteConfig()

    // Crear un elemento de estilo
    let styleEl = document.getElementById("theme-styles")
    if (!styleEl) {
      styleEl = document.createElement("style")
      styleEl.id = "theme-styles"
      document.head.appendChild(styleEl)
    }

    // Aplicar variables CSS
    styleEl.textContent = `
      :root {
        --primary-color: ${config.primaryColor || "#B45309"};
        --secondary-color: ${config.secondaryColor || "#F59E0B"};
        --accent-color: ${config.accentColor || "#D97706"};
        --background-color: ${config.backgroundColor || "#F9F5F0"};
        --text-color: ${config.textColor || "#1F2937"};
      }
    `
  }, [])

  // Este componente no renderiza nada
  return null
}

