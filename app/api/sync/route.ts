import { NextResponse } from "next/server"

// API para sincronizar datos con MongoDB
export async function POST(request: Request) {
  try {
    const { data } = await request.json()

    // En una implementación real, aquí sincronizaríamos los datos con MongoDB
    // Por ahora, simulamos una sincronización exitosa

    // Simular un retraso para que parezca que está procesando
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({
      success: true,
      message: "Datos sincronizados correctamente",
      syncTime: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error sincronizando datos:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al sincronizar los datos",
      },
      { status: 500 },
    )
  }
}

