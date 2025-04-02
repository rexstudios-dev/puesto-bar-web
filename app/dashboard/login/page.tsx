import type { Metadata } from "next"
import DashboardLoginForm from "@/components/dashboard/login-form"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Dashboard Login - Puesto Bar",
  description: "Acceso al panel de administración principal de Puesto Bar",
}

export default function DashboardLoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-amber-900">Puesto Bar</h1>
        <p className="text-gray-600 mt-2">Panel de Administración Principal</p>
      </div>

      <DashboardLoginForm />
      <Toaster />
    </div>
  )
}

