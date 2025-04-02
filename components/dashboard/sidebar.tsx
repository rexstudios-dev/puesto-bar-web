"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Menu, Palette, FileText, Instagram, Settings, Upload, Users, Music, Database } from "lucide-react"

export default function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Menú y Precios",
      href: "/dashboard/menu",
      icon: <Menu className="h-5 w-5" />,
    },
    {
      name: "Apariencia",
      href: "/dashboard/apariencia",
      icon: <Palette className="h-5 w-5" />,
    },
    {
      name: "Contenido",
      href: "/dashboard/contenido",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Instagram",
      href: "/dashboard/instagram",
      icon: <Instagram className="h-5 w-5" />,
    },
    {
      name: "Música",
      href: "/dashboard/musica",
      icon: <Music className="h-5 w-5" />,
    },
    {
      name: "Subir Archivos",
      href: "/dashboard/archivos",
      icon: <Upload className="h-5 w-5" />,
    },
    {
      name: "Usuarios",
      href: "/dashboard/usuarios",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "MongoDB",
      href: "/dashboard/mongodb",
      icon: <Database className="h-5 w-5" />,
    },
    {
      name: "Configuración",
      href: "/dashboard/configuracion",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="w-64 bg-white shadow-md flex-shrink-0 h-screen overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 bg-amber-600 rounded-md flex items-center justify-center text-white font-bold">P</div>
          <span className="text-xl font-bold text-amber-900">Puesto Bar</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive(item.href)
                  ? "bg-amber-50 text-amber-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-amber-700"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

