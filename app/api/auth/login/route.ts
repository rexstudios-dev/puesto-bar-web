import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    // Obtener la contraseña del archivo .env
    const correctPassword = process.env.ADMIN_PASSWORD

    if (!correctPassword) {
      console.error("ADMIN_PASSWORD no está configurada en las variables de entorno")
      return NextResponse.json({ error: "Error de configuración del servidor" }, { status: 500 })
    }

    // Verificar la contraseña
    if (password === correctPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error en la autenticación:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

