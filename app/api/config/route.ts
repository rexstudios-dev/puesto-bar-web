import { NextResponse } from "next/server"
import type { SiteConfig } from "@/lib/store"

// API para guardar la configuración
export async function POST(request: Request) {
  try {
    const config = (await request.json()) as Partial<SiteConfig>

    // En una implementación real, aquí guardaríamos la configuración en MongoDB
    // Por ahora, simplemente devolvemos la configuración recibida

    return NextResponse.json({
      success: true,
      message: "Configuración guardada correctamente",
      config,
    })
  } catch (error) {
    console.error("Error guardando configuración:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al guardar la configuración",
      },
      { status: 500 },
    )
  }
}

// API para obtener la configuración
export async function GET() {
  try {
    // En una implementación real, aquí obtendríamos la configuración de MongoDB
    // Por ahora, devolvemos una configuración predeterminada

    const defaultConfig = {
      siteName: "Puesto Bar",
      siteDescription: "Café, comida y tragos en San Vicente, Buenos Aires",
      primaryColor: "#B45309",
      secondaryColor: "#F59E0B",
      accentColor: "#D97706",
      backgroundColor: "#F9F5F0",
      textColor: "#1F2937",
    }

    return NextResponse.json({
      success: true,
      config: defaultConfig,
    })
  } catch (error) {
    console.error("Error obteniendo configuración:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al obtener la configuración",
      },
      { status: 500 },
    )
  }
}

