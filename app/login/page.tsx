import type { Metadata } from "next"
import LoginForm from "@/components/login-form"

export const metadata: Metadata = {
  title: "Iniciar Sesión - Puesto Bar",
  description: "Acceso al panel de administración de Puesto Bar",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amber-900 text-center">Puesto Bar</h1>
        <p className="text-gray-600 text-center">Panel de Administración</p>
      </div>

      <LoginForm />
    </div>
  )
}

