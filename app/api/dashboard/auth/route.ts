import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Obtener credenciales del archivo .env
    const correctUsername = process.env.DASHBOARD_USERNAME
    const correctPassword = process.env.DASHBOARD_PASSWORD

    if (!correctUsername || !correctPassword) {
      console.error("Credenciales de dashboard no configuradas en las variables de entorno")
      return NextResponse.json({ error: "Error de configuración del servidor" }, { status: 500 })
    }

    // Verificar las credenciales
    if (username === correctUsername && password === correctPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error en la autenticación del dashboard:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

