"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, FileText, Instagram, Settings, DollarSign, LogOut } from "lucide-react"

export default function AdminNavbar() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleLogout = () => {
    // Eliminar datos de autenticación
    localStorage.removeItem("puestoBarAuth")
    localStorage.removeItem("puestoBarAuthTime")

    // Redirigir al login
    router.push("/login")
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-amber-800 font-bold">
              <Home className="h-5 w-5" />
              <span>Puesto Bar</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/admin")
                  ? "bg-amber-100 text-amber-800"
                  : "text-gray-600 hover:bg-amber-50 hover:text-amber-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Menú PDF</span>
              </div>
            </Link>

            <Link
              href="/admin/precios"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/admin/precios")
                  ? "bg-amber-100 text-amber-800"
                  : "text-gray-600 hover:bg-amber-50 hover:text-amber-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>Precios</span>
              </div>
            </Link>

            <Link
              href="/admin/instagram"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/admin/instagram")
                  ? "bg-amber-100 text-amber-800"
                  : "text-gray-600 hover:bg-amber-50 hover:text-amber-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                <span>Instagram</span>
              </div>
            </Link>

            <Link
              href="/admin/settings"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/admin/settings")
                  ? "bg-amber-100 text-amber-800"
                  : "text-gray-600 hover:bg-amber-50 hover:text-amber-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Configuración</span>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Salir</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

