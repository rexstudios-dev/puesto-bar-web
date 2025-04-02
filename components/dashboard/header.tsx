"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bell, Search, LogOut, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function DashboardHeader() {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    // Eliminar datos de autenticación
    localStorage.removeItem("puestoBarDashboardAuth")
    localStorage.removeItem("puestoBarDashboardAuthTime")

    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
      variant: "default",
    })

    // Redirigir al login
    router.push("/dashboard/login")
  }

  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-6">
      <div className="flex-1">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-amber-800" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">Administrador</p>
            <p className="text-xs text-gray-500">admin@puestobar.com</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}

